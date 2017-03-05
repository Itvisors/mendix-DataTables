package datatablesutils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.apache.commons.lang.math.NumberUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.mendix.core.Core;
import com.mendix.externalinterface.connector.RequestHandler;
import com.mendix.logging.ILogNode;
import com.mendix.m2ee.api.IMxRuntimeRequest;
import com.mendix.m2ee.api.IMxRuntimeResponse;
import com.mendix.systemwideinterfaces.connectionbus.data.IDataRow;
import com.mendix.systemwideinterfaces.connectionbus.data.IDataTable;
import com.mendix.systemwideinterfaces.core.IContext;
import com.mendix.systemwideinterfaces.core.IContext.ExecutionType;
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
		
		try {
			// Pull the data from the request.
			String viewName = getStringParameter(request, "view");
			String search = getStringParameter(request, "view");
			String columns = getStringParameter(request, "columns");
			List<String> columnList = Arrays.asList(columns.split(","));
			String sort = getStringParameter(request, "sort");
			int offset = getIntParameter(request, "offset");
			int limit = getIntParameter(request, "limit");
			if (limit == 0) {
				limit = DEFAULT_LIMIT;
			}
			
			ISession session = this.getSessionFromRequest(request);
			if (session == null) {
				responseStatus = IMxRuntimeResponse.UNAUTHORIZED;
			} else {
				IContext context = session.createContext();
				List<DataTablesView> viewList = DataTablesView.load(context, "[Name='" + viewName + "']");
				if (viewList.isEmpty()) {
					logger.error("View " + viewName + " not found"); 
					responseStatus = IMxRuntimeResponse.NOT_FOUND;
				} else {
					JSONArray resultArray = new JSONArray();
					responseJSON.put("results", resultArray);
					DataTablesView view = viewList.get(0);
					IDataTable dataTable = Core.retrieveOQLDataTable(context, view.getQuery(), limit, offset);
					int rowIndex = 0;
					for (IDataRow row : dataTable) {
						JSONObject rowObject = new JSONObject();
						resultArray.put(rowObject);
						rowIndex++;
						logger.trace("Row " + rowIndex);
						for (String columnName : columnList) {
							if (row.hasReadRights(columnName)) {
								final Object value = row.getValue(context, columnName);
								logger.trace("  " + columnName + "=" + value);
								rowObject.put(columnName, value);
							}
						}
					}
					responseJSON.put("rowCount", dataTable.getRowCount());
				}
			}
			
			responseJSON.put("status", responseStatus);
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
