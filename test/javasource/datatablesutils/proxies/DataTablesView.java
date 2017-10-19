// This file was generated by Mendix Modeler.
//
// WARNING: Code you write here will be lost the next time you deploy the project.

package datatablesutils.proxies;

public class DataTablesView
{
	private final com.mendix.systemwideinterfaces.core.IMendixObject dataTablesViewMendixObject;

	private final com.mendix.systemwideinterfaces.core.IContext context;

	/**
	 * Internal name of this entity
	 */
	public static final java.lang.String entityName = "DataTablesUtils.DataTablesView";

	/**
	 * Enum describing members of this entity
	 */
	public enum MemberNames
	{
		Name("Name"),
		Description("Description"),
		Active("Active"),
		ViewType("ViewType"),
		FromEntity("FromEntity"),
		GroupByClause("GroupByClause"),
		WhereClause("WhereClause"),
		ValidateState("ValidateState"),
		DefaultSelectClause("DefaultSelectClause"),
		ValidationErrorDetails("ValidationErrorDetails"),
		DataTablesView_MxObjectType("DataTablesUtils.DataTablesView_MxObjectType");

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

	public DataTablesView(com.mendix.systemwideinterfaces.core.IContext context)
	{
		this(context, com.mendix.core.Core.instantiate(context, "DataTablesUtils.DataTablesView"));
	}

	protected DataTablesView(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject dataTablesViewMendixObject)
	{
		if (dataTablesViewMendixObject == null)
			throw new java.lang.IllegalArgumentException("The given object cannot be null.");
		if (!com.mendix.core.Core.isSubClassOf("DataTablesUtils.DataTablesView", dataTablesViewMendixObject.getType()))
			throw new java.lang.IllegalArgumentException("The given object is not a DataTablesUtils.DataTablesView");

		this.dataTablesViewMendixObject = dataTablesViewMendixObject;
		this.context = context;
	}

	/**
	 * @deprecated Use 'DataTablesView.load(IContext, IMendixIdentifier)' instead.
	 */
	@Deprecated
	public static datatablesutils.proxies.DataTablesView initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		return datatablesutils.proxies.DataTablesView.load(context, mendixIdentifier);
	}

	/**
	 * Initialize a proxy using context (recommended). This context will be used for security checking when the get- and set-methods without context parameters are called.
	 * The get- and set-methods with context parameter should be used when for instance sudo access is necessary (IContext.getSudoContext() can be used to obtain sudo access).
	 */
	public static datatablesutils.proxies.DataTablesView initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject mendixObject)
	{
		return new datatablesutils.proxies.DataTablesView(context, mendixObject);
	}

	public static datatablesutils.proxies.DataTablesView load(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		com.mendix.systemwideinterfaces.core.IMendixObject mendixObject = com.mendix.core.Core.retrieveId(context, mendixIdentifier);
		return datatablesutils.proxies.DataTablesView.initialize(context, mendixObject);
	}

	public static java.util.List<datatablesutils.proxies.DataTablesView> load(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String xpathConstraint) throws com.mendix.core.CoreException
	{
		java.util.List<datatablesutils.proxies.DataTablesView> result = new java.util.ArrayList<datatablesutils.proxies.DataTablesView>();
		for (com.mendix.systemwideinterfaces.core.IMendixObject obj : com.mendix.core.Core.retrieveXPathQuery(context, "//DataTablesUtils.DataTablesView" + xpathConstraint))
			result.add(datatablesutils.proxies.DataTablesView.initialize(context, obj));
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
	 * @return value of Name
	 */
	public final java.lang.String getName()
	{
		return getName(getContext());
	}

	/**
	 * @param context
	 * @return value of Name
	 */
	public final java.lang.String getName(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Name.toString());
	}

	/**
	 * Set value of Name
	 * @param name
	 */
	public final void setName(java.lang.String name)
	{
		setName(getContext(), name);
	}

	/**
	 * Set value of Name
	 * @param context
	 * @param name
	 */
	public final void setName(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String name)
	{
		getMendixObject().setValue(context, MemberNames.Name.toString(), name);
	}

	/**
	 * @return value of Description
	 */
	public final java.lang.String getDescription()
	{
		return getDescription(getContext());
	}

	/**
	 * @param context
	 * @return value of Description
	 */
	public final java.lang.String getDescription(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Description.toString());
	}

	/**
	 * Set value of Description
	 * @param description
	 */
	public final void setDescription(java.lang.String description)
	{
		setDescription(getContext(), description);
	}

	/**
	 * Set value of Description
	 * @param context
	 * @param description
	 */
	public final void setDescription(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String description)
	{
		getMendixObject().setValue(context, MemberNames.Description.toString(), description);
	}

	/**
	 * @return value of Active
	 */
	public final java.lang.Boolean getActive()
	{
		return getActive(getContext());
	}

	/**
	 * @param context
	 * @return value of Active
	 */
	public final java.lang.Boolean getActive(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Boolean) getMendixObject().getValue(context, MemberNames.Active.toString());
	}

	/**
	 * Set value of Active
	 * @param active
	 */
	public final void setActive(java.lang.Boolean active)
	{
		setActive(getContext(), active);
	}

	/**
	 * Set value of Active
	 * @param context
	 * @param active
	 */
	public final void setActive(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Boolean active)
	{
		getMendixObject().setValue(context, MemberNames.Active.toString(), active);
	}

	/**
	 * Set value of ViewType
	 * @param viewtype
	 */
	public final datatablesutils.proxies.ViewType getViewType()
	{
		return getViewType(getContext());
	}

	/**
	 * @param context
	 * @return value of ViewType
	 */
	public final datatablesutils.proxies.ViewType getViewType(com.mendix.systemwideinterfaces.core.IContext context)
	{
		Object obj = getMendixObject().getValue(context, MemberNames.ViewType.toString());
		if (obj == null)
			return null;

		return datatablesutils.proxies.ViewType.valueOf((java.lang.String) obj);
	}

	/**
	 * Set value of ViewType
	 * @param viewtype
	 */
	public final void setViewType(datatablesutils.proxies.ViewType viewtype)
	{
		setViewType(getContext(), viewtype);
	}

	/**
	 * Set value of ViewType
	 * @param context
	 * @param viewtype
	 */
	public final void setViewType(com.mendix.systemwideinterfaces.core.IContext context, datatablesutils.proxies.ViewType viewtype)
	{
		if (viewtype != null)
			getMendixObject().setValue(context, MemberNames.ViewType.toString(), viewtype.toString());
		else
			getMendixObject().setValue(context, MemberNames.ViewType.toString(), null);
	}

	/**
	 * @return value of FromEntity
	 */
	public final java.lang.String getFromEntity()
	{
		return getFromEntity(getContext());
	}

	/**
	 * @param context
	 * @return value of FromEntity
	 */
	public final java.lang.String getFromEntity(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.FromEntity.toString());
	}

	/**
	 * Set value of FromEntity
	 * @param fromentity
	 */
	public final void setFromEntity(java.lang.String fromentity)
	{
		setFromEntity(getContext(), fromentity);
	}

	/**
	 * Set value of FromEntity
	 * @param context
	 * @param fromentity
	 */
	public final void setFromEntity(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String fromentity)
	{
		getMendixObject().setValue(context, MemberNames.FromEntity.toString(), fromentity);
	}

	/**
	 * @return value of GroupByClause
	 */
	public final java.lang.String getGroupByClause()
	{
		return getGroupByClause(getContext());
	}

	/**
	 * @param context
	 * @return value of GroupByClause
	 */
	public final java.lang.String getGroupByClause(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.GroupByClause.toString());
	}

	/**
	 * Set value of GroupByClause
	 * @param groupbyclause
	 */
	public final void setGroupByClause(java.lang.String groupbyclause)
	{
		setGroupByClause(getContext(), groupbyclause);
	}

	/**
	 * Set value of GroupByClause
	 * @param context
	 * @param groupbyclause
	 */
	public final void setGroupByClause(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String groupbyclause)
	{
		getMendixObject().setValue(context, MemberNames.GroupByClause.toString(), groupbyclause);
	}

	/**
	 * @return value of WhereClause
	 */
	public final java.lang.String getWhereClause()
	{
		return getWhereClause(getContext());
	}

	/**
	 * @param context
	 * @return value of WhereClause
	 */
	public final java.lang.String getWhereClause(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.WhereClause.toString());
	}

	/**
	 * Set value of WhereClause
	 * @param whereclause
	 */
	public final void setWhereClause(java.lang.String whereclause)
	{
		setWhereClause(getContext(), whereclause);
	}

	/**
	 * Set value of WhereClause
	 * @param context
	 * @param whereclause
	 */
	public final void setWhereClause(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String whereclause)
	{
		getMendixObject().setValue(context, MemberNames.WhereClause.toString(), whereclause);
	}

	/**
	 * Set value of ValidateState
	 * @param validatestate
	 */
	public final datatablesutils.proxies.ValidateState getValidateState()
	{
		return getValidateState(getContext());
	}

	/**
	 * @param context
	 * @return value of ValidateState
	 */
	public final datatablesutils.proxies.ValidateState getValidateState(com.mendix.systemwideinterfaces.core.IContext context)
	{
		Object obj = getMendixObject().getValue(context, MemberNames.ValidateState.toString());
		if (obj == null)
			return null;

		return datatablesutils.proxies.ValidateState.valueOf((java.lang.String) obj);
	}

	/**
	 * Set value of ValidateState
	 * @param validatestate
	 */
	public final void setValidateState(datatablesutils.proxies.ValidateState validatestate)
	{
		setValidateState(getContext(), validatestate);
	}

	/**
	 * Set value of ValidateState
	 * @param context
	 * @param validatestate
	 */
	public final void setValidateState(com.mendix.systemwideinterfaces.core.IContext context, datatablesutils.proxies.ValidateState validatestate)
	{
		if (validatestate != null)
			getMendixObject().setValue(context, MemberNames.ValidateState.toString(), validatestate.toString());
		else
			getMendixObject().setValue(context, MemberNames.ValidateState.toString(), null);
	}

	/**
	 * @return value of DefaultSelectClause
	 */
	public final java.lang.String getDefaultSelectClause()
	{
		return getDefaultSelectClause(getContext());
	}

	/**
	 * @param context
	 * @return value of DefaultSelectClause
	 */
	public final java.lang.String getDefaultSelectClause(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.DefaultSelectClause.toString());
	}

	/**
	 * Set value of DefaultSelectClause
	 * @param defaultselectclause
	 */
	public final void setDefaultSelectClause(java.lang.String defaultselectclause)
	{
		setDefaultSelectClause(getContext(), defaultselectclause);
	}

	/**
	 * Set value of DefaultSelectClause
	 * @param context
	 * @param defaultselectclause
	 */
	public final void setDefaultSelectClause(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String defaultselectclause)
	{
		getMendixObject().setValue(context, MemberNames.DefaultSelectClause.toString(), defaultselectclause);
	}

	/**
	 * @return value of ValidationErrorDetails
	 */
	public final java.lang.String getValidationErrorDetails()
	{
		return getValidationErrorDetails(getContext());
	}

	/**
	 * @param context
	 * @return value of ValidationErrorDetails
	 */
	public final java.lang.String getValidationErrorDetails(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.ValidationErrorDetails.toString());
	}

	/**
	 * Set value of ValidationErrorDetails
	 * @param validationerrordetails
	 */
	public final void setValidationErrorDetails(java.lang.String validationerrordetails)
	{
		setValidationErrorDetails(getContext(), validationerrordetails);
	}

	/**
	 * Set value of ValidationErrorDetails
	 * @param context
	 * @param validationerrordetails
	 */
	public final void setValidationErrorDetails(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String validationerrordetails)
	{
		getMendixObject().setValue(context, MemberNames.ValidationErrorDetails.toString(), validationerrordetails);
	}

	/**
	 * @return value of DataTablesView_MxObjectType
	 */
	public final mxmodelreflection.proxies.MxObjectType getDataTablesView_MxObjectType() throws com.mendix.core.CoreException
	{
		return getDataTablesView_MxObjectType(getContext());
	}

	/**
	 * @param context
	 * @return value of DataTablesView_MxObjectType
	 */
	public final mxmodelreflection.proxies.MxObjectType getDataTablesView_MxObjectType(com.mendix.systemwideinterfaces.core.IContext context) throws com.mendix.core.CoreException
	{
		mxmodelreflection.proxies.MxObjectType result = null;
		com.mendix.systemwideinterfaces.core.IMendixIdentifier identifier = getMendixObject().getValue(context, MemberNames.DataTablesView_MxObjectType.toString());
		if (identifier != null)
			result = mxmodelreflection.proxies.MxObjectType.load(context, identifier);
		return result;
	}

	/**
	 * Set value of DataTablesView_MxObjectType
	 * @param datatablesview_mxobjecttype
	 */
	public final void setDataTablesView_MxObjectType(mxmodelreflection.proxies.MxObjectType datatablesview_mxobjecttype)
	{
		setDataTablesView_MxObjectType(getContext(), datatablesview_mxobjecttype);
	}

	/**
	 * Set value of DataTablesView_MxObjectType
	 * @param context
	 * @param datatablesview_mxobjecttype
	 */
	public final void setDataTablesView_MxObjectType(com.mendix.systemwideinterfaces.core.IContext context, mxmodelreflection.proxies.MxObjectType datatablesview_mxobjecttype)
	{
		if (datatablesview_mxobjecttype == null)
			getMendixObject().setValue(context, MemberNames.DataTablesView_MxObjectType.toString(), null);
		else
			getMendixObject().setValue(context, MemberNames.DataTablesView_MxObjectType.toString(), datatablesview_mxobjecttype.getMendixObject().getId());
	}

	/**
	 * @return the IMendixObject instance of this proxy for use in the Core interface.
	 */
	public final com.mendix.systemwideinterfaces.core.IMendixObject getMendixObject()
	{
		return dataTablesViewMendixObject;
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
			final datatablesutils.proxies.DataTablesView that = (datatablesutils.proxies.DataTablesView) obj;
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
		return "DataTablesUtils.DataTablesView";
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
