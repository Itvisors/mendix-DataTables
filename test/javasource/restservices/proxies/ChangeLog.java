// This file was generated by Mendix Modeler.
//
// WARNING: Code you write here will be lost the next time you deploy the project.

package restservices.proxies;

public class ChangeLog
{
	private final com.mendix.systemwideinterfaces.core.IMendixObject changeLogMendixObject;

	private final com.mendix.systemwideinterfaces.core.IContext context;

	/**
	 * Internal name of this entity
	 */
	public static final java.lang.String entityName = "RestServices.ChangeLog";

	/**
	 * Enum describing members of this entity
	 */
	public enum MemberNames
	{
		SequenceNr("SequenceNr"),
		_ConfigurationHash("_ConfigurationHash"),
		NrOfConnections("NrOfConnections"),
		ChangeLog_ServiceDefinition("RestServices.ChangeLog_ServiceDefinition");

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

	public ChangeLog(com.mendix.systemwideinterfaces.core.IContext context)
	{
		this(context, com.mendix.core.Core.instantiate(context, "RestServices.ChangeLog"));
	}

	protected ChangeLog(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject changeLogMendixObject)
	{
		if (changeLogMendixObject == null)
			throw new java.lang.IllegalArgumentException("The given object cannot be null.");
		if (!com.mendix.core.Core.isSubClassOf("RestServices.ChangeLog", changeLogMendixObject.getType()))
			throw new java.lang.IllegalArgumentException("The given object is not a RestServices.ChangeLog");

		this.changeLogMendixObject = changeLogMendixObject;
		this.context = context;
	}

	/**
	 * @deprecated Use 'ChangeLog.load(IContext, IMendixIdentifier)' instead.
	 */
	@Deprecated
	public static restservices.proxies.ChangeLog initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		return restservices.proxies.ChangeLog.load(context, mendixIdentifier);
	}

	/**
	 * Initialize a proxy using context (recommended). This context will be used for security checking when the get- and set-methods without context parameters are called.
	 * The get- and set-methods with context parameter should be used when for instance sudo access is necessary (IContext.getSudoContext() can be used to obtain sudo access).
	 */
	public static restservices.proxies.ChangeLog initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject mendixObject)
	{
		return new restservices.proxies.ChangeLog(context, mendixObject);
	}

	public static restservices.proxies.ChangeLog load(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		com.mendix.systemwideinterfaces.core.IMendixObject mendixObject = com.mendix.core.Core.retrieveId(context, mendixIdentifier);
		return restservices.proxies.ChangeLog.initialize(context, mendixObject);
	}

	public static java.util.List<restservices.proxies.ChangeLog> load(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String xpathConstraint) throws com.mendix.core.CoreException
	{
		java.util.List<restservices.proxies.ChangeLog> result = new java.util.ArrayList<restservices.proxies.ChangeLog>();
		for (com.mendix.systemwideinterfaces.core.IMendixObject obj : com.mendix.core.Core.retrieveXPathQuery(context, "//RestServices.ChangeLog" + xpathConstraint))
			result.add(restservices.proxies.ChangeLog.initialize(context, obj));
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
	 * @return value of SequenceNr
	 */
	public final java.lang.Long getSequenceNr()
	{
		return getSequenceNr(getContext());
	}

	/**
	 * @param context
	 * @return value of SequenceNr
	 */
	public final java.lang.Long getSequenceNr(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Long) getMendixObject().getValue(context, MemberNames.SequenceNr.toString());
	}

	/**
	 * Set value of SequenceNr
	 * @param sequencenr
	 */
	public final void setSequenceNr(java.lang.Long sequencenr)
	{
		setSequenceNr(getContext(), sequencenr);
	}

	/**
	 * Set value of SequenceNr
	 * @param context
	 * @param sequencenr
	 */
	public final void setSequenceNr(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Long sequencenr)
	{
		getMendixObject().setValue(context, MemberNames.SequenceNr.toString(), sequencenr);
	}

	/**
	 * @return value of _ConfigurationHash
	 */
	public final java.lang.String get_ConfigurationHash()
	{
		return get_ConfigurationHash(getContext());
	}

	/**
	 * @param context
	 * @return value of _ConfigurationHash
	 */
	public final java.lang.String get_ConfigurationHash(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames._ConfigurationHash.toString());
	}

	/**
	 * Set value of _ConfigurationHash
	 * @param _configurationhash
	 */
	public final void set_ConfigurationHash(java.lang.String _configurationhash)
	{
		set_ConfigurationHash(getContext(), _configurationhash);
	}

	/**
	 * Set value of _ConfigurationHash
	 * @param context
	 * @param _configurationhash
	 */
	public final void set_ConfigurationHash(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String _configurationhash)
	{
		getMendixObject().setValue(context, MemberNames._ConfigurationHash.toString(), _configurationhash);
	}

	/**
	 * @return value of NrOfConnections
	 */
	public final java.lang.Integer getNrOfConnections()
	{
		return getNrOfConnections(getContext());
	}

	/**
	 * @param context
	 * @return value of NrOfConnections
	 */
	public final java.lang.Integer getNrOfConnections(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Integer) getMendixObject().getValue(context, MemberNames.NrOfConnections.toString());
	}

	/**
	 * Set value of NrOfConnections
	 * @param nrofconnections
	 */
	public final void setNrOfConnections(java.lang.Integer nrofconnections)
	{
		setNrOfConnections(getContext(), nrofconnections);
	}

	/**
	 * Set value of NrOfConnections
	 * @param context
	 * @param nrofconnections
	 */
	public final void setNrOfConnections(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Integer nrofconnections)
	{
		getMendixObject().setValue(context, MemberNames.NrOfConnections.toString(), nrofconnections);
	}

	/**
	 * @return value of ChangeLog_ServiceDefinition
	 */
	public final restservices.proxies.DataServiceDefinition getChangeLog_ServiceDefinition() throws com.mendix.core.CoreException
	{
		return getChangeLog_ServiceDefinition(getContext());
	}

	/**
	 * @param context
	 * @return value of ChangeLog_ServiceDefinition
	 */
	public final restservices.proxies.DataServiceDefinition getChangeLog_ServiceDefinition(com.mendix.systemwideinterfaces.core.IContext context) throws com.mendix.core.CoreException
	{
		restservices.proxies.DataServiceDefinition result = null;
		com.mendix.systemwideinterfaces.core.IMendixIdentifier identifier = getMendixObject().getValue(context, MemberNames.ChangeLog_ServiceDefinition.toString());
		if (identifier != null)
			result = restservices.proxies.DataServiceDefinition.load(context, identifier);
		return result;
	}

	/**
	 * Set value of ChangeLog_ServiceDefinition
	 * @param changelog_servicedefinition
	 */
	public final void setChangeLog_ServiceDefinition(restservices.proxies.DataServiceDefinition changelog_servicedefinition)
	{
		setChangeLog_ServiceDefinition(getContext(), changelog_servicedefinition);
	}

	/**
	 * Set value of ChangeLog_ServiceDefinition
	 * @param context
	 * @param changelog_servicedefinition
	 */
	public final void setChangeLog_ServiceDefinition(com.mendix.systemwideinterfaces.core.IContext context, restservices.proxies.DataServiceDefinition changelog_servicedefinition)
	{
		if (changelog_servicedefinition == null)
			getMendixObject().setValue(context, MemberNames.ChangeLog_ServiceDefinition.toString(), null);
		else
			getMendixObject().setValue(context, MemberNames.ChangeLog_ServiceDefinition.toString(), changelog_servicedefinition.getMendixObject().getId());
	}

	/**
	 * @return the IMendixObject instance of this proxy for use in the Core interface.
	 */
	public final com.mendix.systemwideinterfaces.core.IMendixObject getMendixObject()
	{
		return changeLogMendixObject;
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
			final restservices.proxies.ChangeLog that = (restservices.proxies.ChangeLog) obj;
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
		return "RestServices.ChangeLog";
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
