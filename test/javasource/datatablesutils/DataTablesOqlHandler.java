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
import com.mendix.core.CoreException;
import com.mendix.logging.ILogNode;
import com.mendix.m2ee.api.IMxRuntimeRequest;
import com.mendix.m2ee.api.IMxRuntimeResponse;
import com.mendix.systemwideinterfaces.connectionbus.data.IDataRow;
import com.mendix.systemwideinterfaces.connectionbus.data.IDataTable;
import com.mendix.systemwideinterfaces.core.IContext;
import com.mendix.systemwideinterfaces.core.IMendixObject;
import com.mendix.systemwideinterfaces.core.ISession;

import datatablesutils.proxies.DataTablesView;
import datatablesutils.proxies.JoinedEntity;
import datatablesutils.proxies.constants.Constants;

public class DataTablesOqlHandler {

	private static final int DEFAULT_LIMIT = 200;
	private static ILogNode logger = Core.getLogger(Constants.getLOGNODE_DATATABLES_UTILS());

	private JSONObject responseJSON = new JSONObject();
	private int responseStatus = IMxRuntimeResponse.OK;
	private JSONArray errorMessageArray = new JSONArray();
	private DataTablesView view = null;
	private List<String> columnNameList = null;
	private IContext context  = null;
	private IDataTable dataTable = null;
	private boolean isDebugActive = logger.isDebugEnabled();
	private boolean isTraceActive = logger.isTraceEnabled();
	
	public void processRequest(IMxRuntimeRequest request, ISession session, IMxRuntimeResponse response) {
		
		
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
			
			// Check the session
			if (session == null) {
				responseStatus = IMxRuntimeResponse.UNAUTHORIZED;
			}

			// Required parameters
			if (responseStatus == IMxRuntimeResponse.OK) {
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
			}
			
			// Still valid? 
			if (responseStatus == IMxRuntimeResponse.OK) {
				
				// Process requested columns. The names are case sensitive.
				// When a column is in alias.name format, save the alias too.
				columnNameList = Arrays.asList(columns.split(","));
			
				// Get the context.
				context = session.createContext();
				if (context == null) {
					responseStatus = IMxRuntimeResponse.UNAUTHORIZED;
					errorMessageArray.put("Unable to get a context from the session");					
				}
			}
			
			// Still valid? Get the view.
			if (responseStatus == IMxRuntimeResponse.OK) {
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
				
				// Get the data
				String query = createQuery(columns);
				dataTable = Core.retrieveOQLDataTable(context, query, limit, offset);
				
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
					for (int columnIndex  = 0; columnIndex  < columnNameList.size(); columnIndex ++) {
						final String columnName = columnNameList.get(columnIndex);
						if (row.hasReadRights(columnIndex)) {
							final Object value = row.getValue(context, columnIndex);
							if (isTraceActive) {
								logger.trace("  " + columnName + "=" + value);
							}
							rowObject.put(columnName, value);
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
	
	private String createQuery(String columns) throws CoreException {
		
		StringBuilder query = new StringBuilder("SELECT ");
		query.append(columns);
		query.append(" FROM ");
		query.append(view.getFromEntity());
		
		String xpathQuery = "//DataTablesUtils.JoinedEntity[DataTablesUtils.JoinedEntity_DataTablesView=" + view.getMendixObject().getId().toLong() + "]";
		Map<String, String> sortMap = new HashMap<>();
		sortMap.put("JoinOrder", "ASC");
		List<IMendixObject> joinObjList = Core.retrieveXPathQuery(context, xpathQuery, 0, 0, sortMap);
		for (IMendixObject mendixObject : joinObjList) {
			JoinedEntity join = JoinedEntity.initialize(context, mendixObject);
			switch (join.getJoinType()) {
			case FullOuter:		query.append(" FULL OUTER JOIN ");		break;
			case LeftOuter:		query.append(" LEFT OUTER JOIN ");		break;
			case RightOuter:	query.append(" RIGHT OUTER JOIN ");		break;
			default:			query.append(" JOIN ");					break;
			}
			query.append(join.getPath());
			final String entityAlias = join.getEntityAlias();
			if (entityAlias != null && !entityAlias.trim().isEmpty()) {
				query.append(" AS ");
				query.append(entityAlias);
			}
		}
		
		if (isDebugActive) {
			logger.debug(query.toString());
		}
		return query.toString();
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
