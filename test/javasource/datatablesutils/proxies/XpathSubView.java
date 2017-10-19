// This file was generated by Mendix Modeler.
//
// WARNING: Code you write here will be lost the next time you deploy the project.

package datatablesutils.proxies;

public class XpathSubView
{
	private final com.mendix.systemwideinterfaces.core.IMendixObject xpathSubViewMendixObject;

	private final com.mendix.systemwideinterfaces.core.IContext context;

	/**
	 * Internal name of this entity
	 */
	public static final java.lang.String entityName = "DataTablesUtils.XpathSubView";

	/**
	 * Enum describing members of this entity
	 */
	public enum MemberNames
	{
		Path("Path"),
		Prefix("Prefix"),
		XpathSubView_DataTablesView("DataTablesUtils.XpathSubView_DataTablesView"),
		XpathSubView_XpathReference("DataTablesUtils.XpathSubView_XpathReference");

		private java.lang.String metaName;

		MemberNames(java.lang.String s)
		{
			metaName = s;
		}

		@Override
		public java.lang.String toString()
		{
			return metaName;
		}
	}

	public XpathSubView(com.mendix.systemwideinterfaces.core.IContext context)
	{
		this(context, com.mendix.core.Core.instantiate(context, "DataTablesUtils.XpathSubView"));
	}

	protected XpathSubView(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject xpathSubViewMendixObject)
	{
		if (xpathSubViewMendixObject == null)
			throw new java.lang.IllegalArgumentException("The given object cannot be null.");
		if (!com.mendix.core.Core.isSubClassOf("DataTablesUtils.XpathSubView", xpathSubViewMendixObject.getType()))
			throw new java.lang.IllegalArgumentException("The given object is not a DataTablesUtils.XpathSubView");

		this.xpathSubViewMendixObject = xpathSubViewMendixObject;
		this.context = context;
	}

	/**
	 * @deprecated Use 'XpathSubView.load(IContext, IMendixIdentifier)' instead.
	 */
	@Deprecated
	public static datatablesutils.proxies.XpathSubView initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		return datatablesutils.proxies.XpathSubView.load(context, mendixIdentifier);
	}

	/**
	 * Initialize a proxy using context (recommended). This context will be used for security checking when the get- and set-methods without context parameters are called.
	 * The get- and set-methods with context parameter should be used when for instance sudo access is necessary (IContext.getSudoContext() can be used to obtain sudo access).
	 */
	public static datatablesutils.proxies.XpathSubView initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject mendixObject)
	{
		return new datatablesutils.proxies.XpathSubView(context, mendixObject);
	}

	public static datatablesutils.proxies.XpathSubView load(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		com.mendix.systemwideinterfaces.core.IMendixObject mendixObject = com.mendix.core.Core.retrieveId(context, mendixIdentifier);
		return datatablesutils.proxies.XpathSubView.initialize(context, mendixObject);
	}

	public static java.util.List<datatablesutils.proxies.XpathSubView> load(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String xpathConstraint) throws com.mendix.core.CoreException
	{
		java.util.List<datatablesutils.proxies.XpathSubView> result = new java.util.ArrayList<datatablesutils.proxies.XpathSubView>();
		for (com.mendix.systemwideinterfaces.core.IMendixObject obj : com.mendix.core.Core.retrieveXPathQuery(context, "//DataTablesUtils.XpathSubView" + xpathConstraint))
			result.add(datatablesutils.proxies.XpathSubView.initialize(context, obj));
		return result;
	}

	/**
	 * Commit the changes made on this proxy object.
	 */
	public final void commit() throws com.mendix.core.CoreException
	{
		com.mendix.core.Core.commit(context, getMendixObject());
	}

	/**
	 * Commit the changes made on this proxy object using the specified context.
	 */
	public final void commit(com.mendix.systemwideinterfaces.core.IContext context) throws com.mendix.core.CoreException
	{
		com.mendix.core.Core.commit(context, getMendixObject());
	}

	/**
	 * Delete the object.
	 */
	public final void delete()
	{
		com.mendix.core.Core.delete(context, getMendixObject());
	}

	/**
	 * Delete the object using the specified context.
	 */
	public final void delete(com.mendix.systemwideinterfaces.core.IContext context)
	{
		com.mendix.core.Core.delete(context, getMendixObject());
	}
	/**
	 * @return value of Path
	 */
	public final java.lang.String getPath()
	{
		return getPath(getContext());
	}

	/**
	 * @param context
	 * @return value of Path
	 */
	public final java.lang.String getPath(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Path.toString());
	}

	/**
	 * Set value of Path
	 * @param path
	 */
	public final void setPath(java.lang.String path)
	{
		setPath(getContext(), path);
	}

	/**
	 * Set value of Path
	 * @param context
	 * @param path
	 */
	public final void setPath(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String path)
	{
		getMendixObject().setValue(context, MemberNames.Path.toString(), path);
	}

	/**
	 * @return value of Prefix
	 */
	public final java.lang.String getPrefix()
	{
		return getPrefix(getContext());
	}

	/**
	 * @param context
	 * @return value of Prefix
	 */
	public final java.lang.String getPrefix(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Prefix.toString());
	}

	/**
	 * Set value of Prefix
	 * @param prefix
	 */
	public final void setPrefix(java.lang.String prefix)
	{
		setPrefix(getContext(), prefix);
	}

	/**
	 * Set value of Prefix
	 * @param context
	 * @param prefix
	 */
	public final void setPrefix(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String prefix)
	{
		getMendixObject().setValue(context, MemberNames.Prefix.toString(), prefix);
	}

	/**
	 * @return value of XpathSubView_DataTablesView
	 */
	public final datatablesutils.proxies.DataTablesView getXpathSubView_DataTablesView() throws com.mendix.core.CoreException
	{
		return getXpathSubView_DataTablesView(getContext());
	}

	/**
	 * @param context
	 * @return value of XpathSubView_DataTablesView
	 */
	public final datatablesutils.proxies.DataTablesView getXpathSubView_DataTablesView(com.mendix.systemwideinterfaces.core.IContext context) throws com.mendix.core.CoreException
	{
		datatablesutils.proxies.DataTablesView result = null;
		com.mendix.systemwideinterfaces.core.IMendixIdentifier identifier = getMendixObject().getValue(context, MemberNames.XpathSubView_DataTablesView.toString());
		if (identifier != null)
			result = datatablesutils.proxies.DataTablesView.load(context, identifier);
		return result;
	}

	/**
	 * Set value of XpathSubView_DataTablesView
	 * @param xpathsubview_datatablesview
	 */
	public final void setXpathSubView_DataTablesView(datatablesutils.proxies.DataTablesView xpathsubview_datatablesview)
	{
		setXpathSubView_DataTablesView(getContext(), xpathsubview_datatablesview);
	}

	/**
	 * Set value of XpathSubView_DataTablesView
	 * @param context
	 * @param xpathsubview_datatablesview
	 */
	public final void setXpathSubView_DataTablesView(com.mendix.systemwideinterfaces.core.IContext context, datatablesutils.proxies.DataTablesView xpathsubview_datatablesview)
	{
		if (xpathsubview_datatablesview == null)
			getMendixObject().setValue(context, MemberNames.XpathSubView_DataTablesView.toString(), null);
		else
			getMendixObject().setValue(context, MemberNames.XpathSubView_DataTablesView.toString(), xpathsubview_datatablesview.getMendixObject().getId());
	}

	/**
	 * @return value of XpathSubView_XpathReference
	 */
	public final datatablesutils.proxies.XpathReference getXpathSubView_XpathReference() throws com.mendix.core.CoreException
	{
		return getXpathSubView_XpathReference(getContext());
	}

	/**
	 * @param context
	 * @return value of XpathSubView_XpathReference
	 */
	public final datatablesutils.proxies.XpathReference getXpathSubView_XpathReference(com.mendix.systemwideinterfaces.core.IContext context) throws com.mendix.core.CoreException
	{
		datatablesutils.proxies.XpathReference result = null;
		com.mendix.systemwideinterfaces.core.IMendixIdentifier identifier = getMendixObject().getValue(context, MemberNames.XpathSubView_XpathReference.toString());
		if (identifier != null)
			result = datatablesutils.proxies.XpathReference.load(context, identifier);
		return result;
	}

	/**
	 * Set value of XpathSubView_XpathReference
	 * @param xpathsubview_xpathreference
	 */
	public final void setXpathSubView_XpathReference(datatablesutils.proxies.XpathReference xpathsubview_xpathreference)
	{
		setXpathSubView_XpathReference(getContext(), xpathsubview_xpathreference);
	}

	/**
	 * Set value of XpathSubView_XpathReference
	 * @param context
	 * @param xpathsubview_xpathreference
	 */
	public final void setXpathSubView_XpathReference(com.mendix.systemwideinterfaces.core.IContext context, datatablesutils.proxies.XpathReference xpathsubview_xpathreference)
	{
		if (xpathsubview_xpathreference == null)
			getMendixObject().setValue(context, MemberNames.XpathSubView_XpathReference.toString(), null);
		else
			getMendixObject().setValue(context, MemberNames.XpathSubView_XpathReference.toString(), xpathsubview_xpathreference.getMendixObject().getId());
	}

	/**
	 * @return the IMendixObject instance of this proxy for use in the Core interface.
	 */
	public final com.mendix.systemwideinterfaces.core.IMendixObject getMendixObject()
	{
		return xpathSubViewMendixObject;
	}

	/**
	 * @return the IContext instance of this proxy, or null if no IContext instance was specified at initialization.
	 */
	public final com.mendix.systemwideinterfaces.core.IContext getContext()
	{
		return context;
	}

	@Override
	public boolean equals(Object obj)
	{
		if (obj == this)
			return true;

		if (obj != null && getClass().equals(obj.getClass()))
		{
			final datatablesutils.proxies.XpathSubView that = (datatablesutils.proxies.XpathSubView) obj;
			return getMendixObject().equals(that.getMendixObject());
		}
		return false;
	}

	@Override
	public int hashCode()
	{
		return getMendixObject().hashCode();
	}

	/**
	 * @return String name of this class
	 */
	public static java.lang.String getType()
	{
		return "DataTablesUtils.XpathSubView";
	}

	/**
	 * @return String GUID from this object, format: ID_0000000000
	 * @deprecated Use getMendixObject().getId().toLong() to get a unique identifier for this object.
	 */
	@Deprecated
	public java.lang.String getGUID()
	{
		return "ID_" + getMendixObject().getId().toLong();
	}
}
