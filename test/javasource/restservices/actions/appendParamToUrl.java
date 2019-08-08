// This file was generated by Mendix Modeler.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the import list
// - the code between BEGIN USER CODE and END USER CODE
// - the code between BEGIN EXTRA CODE and END EXTRA CODE
// Other code you write will be lost the next time you deploy the project.
// Special characters, e.g., é, ö, à, etc. are supported in comments.

package restservices.actions;

import restservices.util.Utils;
import com.mendix.systemwideinterfaces.core.IContext;
import com.mendix.webui.CustomJavaAction;

/**
 * Adds a URL parameter to a url. Make sure that any encoding required is applied
 */
public class appendParamToUrl extends CustomJavaAction<java.lang.String>
{
	private java.lang.String url;
	private java.lang.String paramName;
	private java.lang.String paramValue;

	public appendParamToUrl(IContext context, java.lang.String url, java.lang.String paramName, java.lang.String paramValue)
	{
		super(context);
		this.url = url;
		this.paramName = paramName;
		this.paramValue = paramValue;
	}

	@java.lang.Override
	public java.lang.String executeAction() throws Exception
	{
		// BEGIN USER CODE
		return Utils.appendParamToUrl(url, paramName, paramValue);
		// END USER CODE
	}

	/**
	 * Returns a string representation of this action
	 */
	@java.lang.Override
	public java.lang.String toString()
	{
		return "appendParamToUrl";
	}

	// BEGIN EXTRA CODE
	// END EXTRA CODE
}
