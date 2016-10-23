package datatablesexportdata;

import org.json.JSONArray;
import org.json.JSONObject;

import com.mendix.core.Core;
import com.mendix.logging.ILogNode;
import com.mendix.systemwideinterfaces.core.IContext;

import datatablesexportdata.proxies.DataTablesExportDocument;
import datatablesexportdata.proxies.constants.Constants;

public class ExportDataImpl {

	private final String CLASS_NAME = getClass().getSimpleName();	
	private final IContext context;
	private final ILogNode logger = Core.getLogger(Constants.getLOGNODE_DATATABLES_EXPORT());
	
	public ExportDataImpl(IContext context) {
		this.context = context;
	}
		
	public DataTablesExportDocument export(String exportConfig, String xpathConstraint) {
		String logPrefix = CLASS_NAME + ".export ";
		if (logger.isTraceEnabled()) {
			logger.trace(logPrefix + "start");
		}		
		
		DataTablesExportDocument exportDocument = null;

		JSONObject jsonObject = new JSONObject(exportConfig);
		
		final boolean exportVisibleColumnsOnly = jsonObject.getBoolean("exportVisibleColumnsOnly");
		final String entityName = jsonObject.getString("tableEntity");
		JSONArray columns = jsonObject.getJSONArray("columns");
		for (JSONObject column : columns.toJSONObjectCollection()) {
			final String caption = column.getString("caption");
			final String attrName = column.getString("attrName");
			final String refName = column.getString("refName");
			final String dateTimeType = column.getString("dateTimeType");
			final String dateFormat = column.getString("dateFormat");
			final String dateTimeFormat = column.getString("dateTimeFormat");
			final String timeFormat = column.getString("timeFormat");
			final boolean groupDigits = column.getBoolean("groupDigits");
			final int decimalPositions = column.getInt("decimalPositions");
			logger.info(caption + ", " + attrName);
		}
		
		return exportDocument;
	}
	
}
