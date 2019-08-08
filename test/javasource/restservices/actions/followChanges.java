// This file was generated by Mendix Modeler.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the import list
// - the code between BEGIN USER CODE and END USER CODE
// - the code between BEGIN EXTRA CODE and END EXTRA CODE
// Other code you write will be lost the next time you deploy the project.
// Special characters, e.g., é, ö, à, etc. are supported in comments.

package restservices.actions;

import restservices.consume.ChangeLogListener;
import com.mendix.systemwideinterfaces.core.IContext;
import com.mendix.webui.CustomJavaAction;

/**
 * Collection url:
 * 
 * Url where the collection resides, for example http://localhost:8080/rest/customers
 * 
 * UpdateMicroflow:
 * will be triggered when a change is received. Should have one input argument which is a transient object, in which the json data will be parsed
 * 
 * DeleteMicroflow:
 * will be triggered when a delete is received. Input argument is the key of the object to be deleted, as string
 * 
 * 
 * Timeout:
 * 
 * timeout of individual in seconds (longer is more efficient, but might cause firewall issues). 0 for unlimited. negative for timeout or return on the first change. Default value should be -50. 
 */
public class followChanges extends CustomJavaAction<java.lang.Boolean>
{
	private java.lang.String collectionUrl;
	private java.lang.String updateMicroflow;
	private java.lang.String deleteMicroflow;
	private java.lang.Long timeout;

	public followChanges(IContext context, java.lang.String collectionUrl, java.lang.String updateMicroflow, java.lang.String deleteMicroflow, java.lang.Long timeout)
	{
		super(context);
		this.collectionUrl = collectionUrl;
		this.updateMicroflow = updateMicroflow;
		this.deleteMicroflow = deleteMicroflow;
		this.timeout = timeout;
	}

	@java.lang.Override
	public java.lang.Boolean executeAction() throws Exception
	{
		// BEGIN USER CODE
		ChangeLogListener.follow(collectionUrl, updateMicroflow, deleteMicroflow, timeout);
		return true;
		// END USER CODE
	}

	/**
	 * Returns a string representation of this action
	 */
	@java.lang.Override
	public java.lang.String toString()
	{
		return "followChanges";
	}

	// BEGIN EXTRA CODE
	// END EXTRA CODE
}
