// This file was generated by Mendix Modeler.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the import list
// - the code between BEGIN USER CODE and END USER CODE
// - the code between BEGIN EXTRA CODE and END EXTRA CODE
// Other code you write will be lost the next time you deploy the project.
// Special characters, e.g., é, ö, à, etc. are supported in comments.

package datatablesutils.actions;

import org.json.JSONObject;
import com.mendix.core.Core;
import com.mendix.logging.ILogNode;
import com.mendix.m2ee.api.IMxRuntimeResponse;
import com.mendix.systemwideinterfaces.connectionbus.data.IDataRow;
import com.mendix.systemwideinterfaces.connectionbus.data.IDataTable;
import com.mendix.systemwideinterfaces.connectionbus.data.IDataTableSchema;
import com.mendix.systemwideinterfaces.core.IContext;
import com.mendix.systemwideinterfaces.core.IContext.ExecutionType;
import com.mendix.webui.CustomJavaAction;
import datatablesutils.DataTablesOqlHandler;
import datatablesutils.proxies.ValidateState;
import datatablesutils.proxies.constants.Constants;
import com.mendix.systemwideinterfaces.core.IMendixObject;

public class ValidateView extends CustomJavaAction<java.lang.Boolean>
{
	private IMendixObject __view;
	private datatablesutils.proxies.DataTablesView view;

	public ValidateView(IContext context, IMendixObject view)
	{
		super(context);
		this.__view = view;
	}

	@Override
	public java.lang.Boolean executeAction() throws Exception
	{
		this.view = __view == null ? null : datatablesutils.proxies.DataTablesView.initialize(getContext(), __view);

		// BEGIN USER CODE

		boolean result = true;
		ILogNode logger = Core.getLogger(Constants.getLOGNODE_DATATABLES_UTILS());
		
		try {
			switch (view.getViewType()) {
			case OQL:
				final DataTablesOqlHandler dataTablesOqlHandler = new DataTablesOqlHandler();
				JSONObject responseJSON = dataTablesOqlHandler.processRequest(view.getName(), null, view.getDefaultSelectClause(), null, 0, 1, getContext().getSession());
				if (responseJSON.getInt("status") == IMxRuntimeResponse.OK) {
					view.setValidateState(ValidateState.OK);
					view.setValidationErrorDetails(null);
					if (logger.isDebugEnabled()) {
						logger.debug("Validation succesful for view " + view.getName() + "\n" + responseJSON.toString());
					}
				} else {
					view.setValidateState(ValidateState.Failed);
					view.setValidationErrorDetails(responseJSON.toString());
					result = false;
				}
				break;

			case XPath:
				//@TODO
				
				break;

			}
		} catch (Exception e2) {
			logger.error("Validation of view " + view.getName() + " resulted in an exception");
			logger.error(e2);
			view.setValidateState(ValidateState.Failed);
			view.setValidationErrorDetails(e2.getMessage());
			result = false;
		}
		view.commit();
//
//		String query =
//				"SELECT lastName,firstName,DataTablesTestModule.Country/Name,System.Language/Code" + 
//				" FROM DataTablesTestModule.Person" + 
//				" JOIN DataTablesTestModule.Person_Country/DataTablesTestModule.Country" + 
//				" JOIN DataTablesTestModule.Person_Country/DataTablesTestModule.Country/DataTablesTestModule.Country_Language/System.Language";
//		final IContext context = getContext();
//		IDataTable dataTable = Core.retrieveOQLDataTable(getContext().getSession().createContext(), query, 1, 0);
//		final IDataTableSchema schema = dataTable.getSchema();
//		for (IDataRow row : dataTable) {
//			for (int columnIndex  = 0; columnIndex  < schema.getColumnCount(); columnIndex ++) {
//				logger.info("hasReadAccess: " + row.hasReadAccess(columnIndex));
//				logger.info("hasReadRights: " + row.hasReadRights(columnIndex));
//				final Object value = row.getValue(context, columnIndex);
//				logger.info("  " + schema.getColumnSchema(columnIndex).getName() + "=" + value);
//			}
//		}		
		return result;
		
		// END USER CODE
	}

	/**
	 * Returns a string representation of this action
	 */
	@Override
	public java.lang.String toString()
	{
		return "ValidateView";
	}

	// BEGIN EXTRA CODE
	// END EXTRA CODE
}
