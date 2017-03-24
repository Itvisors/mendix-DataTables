package datatablesutils;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import org.apache.commons.lang.math.NumberUtils;
import org.json.JSONObject;

import com.mendix.core.Core;
import com.mendix.externalinterface.connector.RequestHandler;
import com.mendix.logging.ILogNode;
import com.mendix.m2ee.api.IMxRuntimeRequest;
import com.mendix.m2ee.api.IMxRuntimeResponse;

import datatablesutils.proxies.constants.Constants;

public class DataTablesRequestHandler extends RequestHandler {

	private static final int DEFAULT_LIMIT = 200;
	private static ILogNode logger = Core.getLogger(Constants.getLOGNODE_DATATABLES_UTILS());
	
	@Override
	protected void processRequest(IMxRuntimeRequest request, IMxRuntimeResponse response, String relativeUrl) throws Exception {

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
			// Process the request
			final DataTablesOqlHandler dataTablesOqlHandler = new DataTablesOqlHandler();
			JSONObject responseJSON = dataTablesOqlHandler.processRequest(viewName, search, columns, sort, offset, limit, this.getSessionFromRequest(request));
			response.setStatus(IMxRuntimeResponse.OK);
			response.getWriter().append(responseJSON.toString());
		} catch (Exception e2) {
			logger.error(e2);
			response.setStatus(IMxRuntimeResponse.INTERNAL_SERVER_ERROR);
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
