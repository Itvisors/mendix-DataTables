package datatablesutils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.math.NumberUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.mendix.core.Core;
import com.mendix.externalinterface.connector.RequestHandler;
import com.mendix.logging.ILogNode;
import com.mendix.m2ee.api.IMxRuntimeRequest;
import com.mendix.m2ee.api.IMxRuntimeResponse;
import com.mendix.systemwideinterfaces.connectionbus.data.IDataColumnSchema;
import com.mendix.systemwideinterfaces.connectionbus.data.IDataRow;
import com.mendix.systemwideinterfaces.connectionbus.data.IDataTable;
import com.mendix.systemwideinterfaces.core.IContext;
import com.mendix.systemwideinterfaces.core.ISession;

import datatablesutils.proxies.DataTablesView;
import datatablesutils.proxies.constants.Constants;

public class DataTablesRequestHandler extends RequestHandler {

	private static final int DEFAULT_LIMIT = 200;
	private static ILogNode logger = Core.getLogger(Constants.getLOGNODE_DATATABLES_UTILS());
	
	@Override
	protected void processRequest(IMxRuntimeRequest request, IMxRuntimeResponse response, String relativeUrl) throws Exception {

		JSONObject responseJSON = new JSONObject();
		int responseStatus = IMxRuntimeResponse.OK;
		JSONArray errorMessageArray = new JSONArray();
		DataTablesView view = null;
		Map<String,OqlDataColumn> columnMap = new HashMap<>();
		ISession session = null;
		IContext context  = null;
		IDataTable dataTable = null;
		boolean isDebugActive = logger.isDebugEnabled();
		boolean isTraceActive = logger.isTraceEnabled();
		
		try {
			// Pull the data from the request.
			String viewName = getStringParameter(request, "view");
			String search = getStringParameter(request, "search");
			String columns = getStringParameter(request, "columns");
			String sort = getStringParameter(request, "sort");
			int offset = getIntParameter(request, "offset");
			int limit = getIntParameter(request, "limit");
			if (limit == 0) {
				limit = DEFAULT_LIMIT;
			}

			// Required parameters
			if (viewName == null || viewName.isEmpty()) {
				responseStatus = IMxRuntimeResponse.BAD_REQUEST;
				errorMessageArray.put("The view parameter is required");
			}
			if (columns == null || columns.isEmpty()) {
				responseStatus = IMxRuntimeResponse.BAD_REQUEST;
				errorMessageArray.put("The columns parameter is required");
			}
			if (sort == null || sort.isEmpty()) {
				responseStatus = IMxRuntimeResponse.BAD_REQUEST;
				errorMessageArray.put("The sort parameter is required");
			}
			
			// Still valid? 
			if (responseStatus == IMxRuntimeResponse.OK) {
				
				// Process requested columns. The names are case sensitive.
				List<String> columnNameList = Arrays.asList(columns.split(","));
				for (String columnName : columnNameList) {
					OqlDataColumn column = new OqlDataColumn();
					column.setRequestedName(columnName);
					column.setColumnIndex(-1);
					// For the key, use the column name without any table ID.
					final String columnNameLowerCase = columnName.toLowerCase();
					String[] nameParts = columnNameLowerCase.split("\\.");
					final String key;
					if (nameParts.length > 1) {
						key = nameParts[1];
					} else {
						key = columnNameLowerCase;
					}
					columnMap.put(key, column);
				}
				
				// Get the session
				session = this.getSessionFromRequest(request);
				if (session == null) {
					responseStatus = IMxRuntimeResponse.UNAUTHORIZED;
				}
			}
			
			// Still valid? Get the view.
			if (responseStatus == IMxRuntimeResponse.OK) {
				context = session.createContext();
				List<DataTablesView> viewList = DataTablesView.load(context, "[Name='" + viewName + "']");
				if (!viewList.isEmpty()) {
					view = viewList.get(0);
				} else {
					String errorMessage = "View " + viewName + " not found";
					errorMessageArray.put(errorMessage);
					logger.error(errorMessage); 
					responseStatus = IMxRuntimeResponse.NOT_FOUND;
				}
			}
			
			// Still valid? Get the data and check the requested columns.
			if (responseStatus == IMxRuntimeResponse.OK) {
				
				StringBuilder query = new StringBuilder("SELECT ");
				query.append(columns);
				query.append(" FROM ");
				query.append(view.getFromEntity());
				query.append(" AS ");
				query.append(view.getFromEntityAlias());
				
				// Get the data
				if (isDebugActive) {
					logger.debug(query.toString());
				}
				dataTable = Core.retrieveOQLDataTable(context, query.toString(), limit, offset);
				
				// Find any requested columns and save the data set column index 
				for (IDataColumnSchema dataColumnSchema : dataTable.getSchema().getColumnSchemas()) {
					String key = dataColumnSchema.getName().toLowerCase();
					if (columnMap.containsKey(key)) {
						OqlDataColumn column = columnMap.get(key);
						column.setColumnIndex(dataColumnSchema.getIndex());
					}
				}
				
				// Find any columns that did not get a column index.
				for (OqlDataColumn column : columnMap.values()) {
					if (column.getColumnIndex() < 0) {
						responseStatus = IMxRuntimeResponse.BAD_REQUEST;
						errorMessageArray.put("Column " + column.getRequestedName() + " does not exist in the data set.");
					}
				}
			}
				// Still valid? Fill the response.
			if (responseStatus == IMxRuntimeResponse.OK) {
				JSONArray resultArray = new JSONArray();
				responseJSON.put("results", resultArray);
				int rowIndex = 0;
				for (IDataRow row : dataTable) {
					JSONObject rowObject = new JSONObject();
					resultArray.put(rowObject);
					rowIndex++;
					if (isTraceActive) {
						logger.trace("Row " + rowIndex);
					}
					for (OqlDataColumn column : columnMap.values()) {
						final int columnIndex = column.getColumnIndex();
						if (columnIndex >= 0) {
							if (row.hasReadRights(columnIndex)) {
								final Object value = row.getValue(context, columnIndex);
								if (isTraceActive) {
									logger.trace("  " + column.getRequestedName() + "=" + value);
								}
								rowObject.put(column.getRequestedName(), value);
							}
						}
					}
				}
				responseJSON.put("rowCount", dataTable.getRowCount());
			}
			
			responseJSON.put("status", responseStatus);
			if (errorMessageArray.length() > 0) {
				responseJSON.put("errors", errorMessageArray);
			}
			response.getWriter().append(responseJSON.toString());
			
		} catch (Exception e) {
			logger.error(e);
			responseStatus = IMxRuntimeResponse.INTERNAL_SERVER_ERROR;
			try {
				responseJSON.put("status", responseStatus);
				response.getWriter().append(responseJSON.toString());
			} catch (Exception e2) {
				logger.error(e2);
				response.setStatus(IMxRuntimeResponse.INTERNAL_SERVER_ERROR);
			}
		}
		
	}
	
	private String getStringParameter(IMxRuntimeRequest request, String parameterName) throws UnsupportedEncodingException {
		String value = request.getParameter(parameterName);
		if (value == null) {
			return null;
		}
		String decodedValue = URLDecoder.decode(value, "UTF-8");
		if (decodedValue.trim().isEmpty()) {
			return "";
		}
		return decodedValue;
	}
	
	private int getIntParameter(IMxRuntimeRequest request, String parameterName) throws UnsupportedEncodingException {
		String value = getStringParameter(request, parameterName);
		if (value == null || value.trim().isEmpty()) {
			return 0;
		}
		int result = 0;
		if (NumberUtils.isDigits(value)) {
			result = Integer.parseInt(value);
		}
		return result;
	}

}
