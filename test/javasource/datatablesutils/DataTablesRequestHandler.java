package datatablesutils;

import com.mendix.externalinterface.connector.RequestHandler;
import com.mendix.m2ee.api.IMxRuntimeRequest;
import com.mendix.m2ee.api.IMxRuntimeResponse;

public class DataTablesRequestHandler extends RequestHandler {

	@Override
	protected void processRequest(IMxRuntimeRequest request, IMxRuntimeResponse response, String relativeUrl) throws Exception {

		new DataTablesOqlHandler().processRequest(request, this.getSessionFromRequest(request), response);
		
	}

}
