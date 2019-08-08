// This file was generated by Mendix Modeler.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the import list
// - the code between BEGIN USER CODE and END USER CODE
// - the code between BEGIN EXTRA CODE and END EXTRA CODE
// Other code you write will be lost the next time you deploy the project.
// Special characters, e.g., é, ö, à, etc. are supported in comments.

package restservices.actions;

import restservices.publish.MicroflowService;
import com.mendix.systemwideinterfaces.core.IContext;
import com.mendix.webui.CustomJavaAction;

public class StartMicroflowServiceJava extends CustomJavaAction<java.lang.Boolean>
{
	private java.lang.String microflowName;
	private java.lang.String securityRoleOrMicroflow;
	private java.lang.String description;
	private restservices.proxies.HttpMethod httpMethod;
	private java.lang.String pathTemplate;

	public StartMicroflowServiceJava(IContext context, java.lang.String microflowName, java.lang.String securityRoleOrMicroflow, java.lang.String description, java.lang.String httpMethod, java.lang.String pathTemplate)
	{
		super(context);
		this.microflowName = microflowName;
		this.securityRoleOrMicroflow = securityRoleOrMicroflow;
		this.description = description;
		this.httpMethod = httpMethod == null ? null : restservices.proxies.HttpMethod.valueOf(httpMethod);
		this.pathTemplate = pathTemplate;
	}

	@java.lang.Override
	public java.lang.Boolean executeAction() throws Exception
	{
		// BEGIN USER CODE
		new MicroflowService(microflowName, securityRoleOrMicroflow, httpMethod, pathTemplate, description);
		return true;
		// END USER CODE
	}

	/**
	 * Returns a string representation of this action
	 */
	@java.lang.Override
	public java.lang.String toString()
	{
		return "StartMicroflowServiceJava";
	}

	// BEGIN EXTRA CODE
	// END EXTRA CODE
}
