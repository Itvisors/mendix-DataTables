// This file was generated by Mendix Modeler.
//
// WARNING: Code you write here will be lost the next time you deploy the project.

package datatablestestmodule.proxies;

public class TestDataTypes
{
	private final com.mendix.systemwideinterfaces.core.IMendixObject testDataTypesMendixObject;

	private final com.mendix.systemwideinterfaces.core.IContext context;

	/**
	 * Internal name of this entity
	 */
	public static final java.lang.String entityName = "DataTablesTestModule.TestDataTypes";

	/**
	 * Enum describing members of this entity
	 */
	public enum MemberNames
	{
		Name("Name"),
		Description("Description"),
		ItemNumber("ItemNumber"),
		Bool("Bool"),
		DateValue("DateValue"),
		DateTimeValue("DateTimeValue"),
		TimeValue("TimeValue"),
		DecimalValue("DecimalValue"),
		DeviceType("DeviceType"),
		FloatValue("FloatValue"),
		IntegerValue("IntegerValue"),
		LongValue("LongValue"),
		CurrencyValue("CurrencyValue");

		private java.lang.String metaName;

		MemberNames(java.lang.String s)
		{
			metaName = s;
		}

		@java.lang.Override
		public java.lang.String toString()
		{
			return metaName;
		}
	}

	public TestDataTypes(com.mendix.systemwideinterfaces.core.IContext context)
	{
		this(context, com.mendix.core.Core.instantiate(context, "DataTablesTestModule.TestDataTypes"));
	}

	protected TestDataTypes(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject testDataTypesMendixObject)
	{
		if (testDataTypesMendixObject == null)
			throw new java.lang.IllegalArgumentException("The given object cannot be null.");
		if (!com.mendix.core.Core.isSubClassOf("DataTablesTestModule.TestDataTypes", testDataTypesMendixObject.getType()))
			throw new java.lang.IllegalArgumentException("The given object is not a DataTablesTestModule.TestDataTypes");

		this.testDataTypesMendixObject = testDataTypesMendixObject;
		this.context = context;
	}

	/**
	 * @deprecated Use 'TestDataTypes.load(IContext, IMendixIdentifier)' instead.
	 */
	@java.lang.Deprecated
	public static datatablestestmodule.proxies.TestDataTypes initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		return datatablestestmodule.proxies.TestDataTypes.load(context, mendixIdentifier);
	}

	/**
	 * Initialize a proxy using context (recommended). This context will be used for security checking when the get- and set-methods without context parameters are called.
	 * The get- and set-methods with context parameter should be used when for instance sudo access is necessary (IContext.createSudoClone() can be used to obtain sudo access).
	 */
	public static datatablestestmodule.proxies.TestDataTypes initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject mendixObject)
	{
		return new datatablestestmodule.proxies.TestDataTypes(context, mendixObject);
	}

	public static datatablestestmodule.proxies.TestDataTypes load(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		com.mendix.systemwideinterfaces.core.IMendixObject mendixObject = com.mendix.core.Core.retrieveId(context, mendixIdentifier);
		return datatablestestmodule.proxies.TestDataTypes.initialize(context, mendixObject);
	}

	public static java.util.List<datatablestestmodule.proxies.TestDataTypes> load(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String xpathConstraint) throws com.mendix.core.CoreException
	{
		java.util.List<datatablestestmodule.proxies.TestDataTypes> result = new java.util.ArrayList<datatablestestmodule.proxies.TestDataTypes>();
		for (com.mendix.systemwideinterfaces.core.IMendixObject obj : com.mendix.core.Core.retrieveXPathQuery(context, "//DataTablesTestModule.TestDataTypes" + xpathConstraint))
			result.add(datatablestestmodule.proxies.TestDataTypes.initialize(context, obj));
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
	 * @return value of ItemNumber
	 */
	public final java.lang.Long getItemNumber()
	{
		return getItemNumber(getContext());
	}

	/**
	 * @param context
	 * @return value of ItemNumber
	 */
	public final java.lang.Long getItemNumber(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Long) getMendixObject().getValue(context, MemberNames.ItemNumber.toString());
	}

	/**
	 * Set value of ItemNumber
	 * @param itemnumber
	 */
	public final void setItemNumber(java.lang.Long itemnumber)
	{
		setItemNumber(getContext(), itemnumber);
	}

	/**
	 * Set value of ItemNumber
	 * @param context
	 * @param itemnumber
	 */
	public final void setItemNumber(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Long itemnumber)
	{
		getMendixObject().setValue(context, MemberNames.ItemNumber.toString(), itemnumber);
	}

	/**
	 * @return value of Bool
	 */
	public final java.lang.Boolean getBool()
	{
		return getBool(getContext());
	}

	/**
	 * @param context
	 * @return value of Bool
	 */
	public final java.lang.Boolean getBool(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Boolean) getMendixObject().getValue(context, MemberNames.Bool.toString());
	}

	/**
	 * Set value of Bool
	 * @param bool
	 */
	public final void setBool(java.lang.Boolean bool)
	{
		setBool(getContext(), bool);
	}

	/**
	 * Set value of Bool
	 * @param context
	 * @param bool
	 */
	public final void setBool(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Boolean bool)
	{
		getMendixObject().setValue(context, MemberNames.Bool.toString(), bool);
	}

	/**
	 * @return value of DateValue
	 */
	public final java.util.Date getDateValue()
	{
		return getDateValue(getContext());
	}

	/**
	 * @param context
	 * @return value of DateValue
	 */
	public final java.util.Date getDateValue(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.util.Date) getMendixObject().getValue(context, MemberNames.DateValue.toString());
	}

	/**
	 * Set value of DateValue
	 * @param datevalue
	 */
	public final void setDateValue(java.util.Date datevalue)
	{
		setDateValue(getContext(), datevalue);
	}

	/**
	 * Set value of DateValue
	 * @param context
	 * @param datevalue
	 */
	public final void setDateValue(com.mendix.systemwideinterfaces.core.IContext context, java.util.Date datevalue)
	{
		getMendixObject().setValue(context, MemberNames.DateValue.toString(), datevalue);
	}

	/**
	 * @return value of DateTimeValue
	 */
	public final java.util.Date getDateTimeValue()
	{
		return getDateTimeValue(getContext());
	}

	/**
	 * @param context
	 * @return value of DateTimeValue
	 */
	public final java.util.Date getDateTimeValue(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.util.Date) getMendixObject().getValue(context, MemberNames.DateTimeValue.toString());
	}

	/**
	 * Set value of DateTimeValue
	 * @param datetimevalue
	 */
	public final void setDateTimeValue(java.util.Date datetimevalue)
	{
		setDateTimeValue(getContext(), datetimevalue);
	}

	/**
	 * Set value of DateTimeValue
	 * @param context
	 * @param datetimevalue
	 */
	public final void setDateTimeValue(com.mendix.systemwideinterfaces.core.IContext context, java.util.Date datetimevalue)
	{
		getMendixObject().setValue(context, MemberNames.DateTimeValue.toString(), datetimevalue);
	}

	/**
	 * @return value of TimeValue
	 */
	public final java.util.Date getTimeValue()
	{
		return getTimeValue(getContext());
	}

	/**
	 * @param context
	 * @return value of TimeValue
	 */
	public final java.util.Date getTimeValue(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.util.Date) getMendixObject().getValue(context, MemberNames.TimeValue.toString());
	}

	/**
	 * Set value of TimeValue
	 * @param timevalue
	 */
	public final void setTimeValue(java.util.Date timevalue)
	{
		setTimeValue(getContext(), timevalue);
	}

	/**
	 * Set value of TimeValue
	 * @param context
	 * @param timevalue
	 */
	public final void setTimeValue(com.mendix.systemwideinterfaces.core.IContext context, java.util.Date timevalue)
	{
		getMendixObject().setValue(context, MemberNames.TimeValue.toString(), timevalue);
	}

	/**
	 * @return value of DecimalValue
	 */
	public final java.math.BigDecimal getDecimalValue()
	{
		return getDecimalValue(getContext());
	}

	/**
	 * @param context
	 * @return value of DecimalValue
	 */
	public final java.math.BigDecimal getDecimalValue(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.math.BigDecimal) getMendixObject().getValue(context, MemberNames.DecimalValue.toString());
	}

	/**
	 * Set value of DecimalValue
	 * @param decimalvalue
	 */
	public final void setDecimalValue(java.math.BigDecimal decimalvalue)
	{
		setDecimalValue(getContext(), decimalvalue);
	}

	/**
	 * Set value of DecimalValue
	 * @param context
	 * @param decimalvalue
	 */
	public final void setDecimalValue(com.mendix.systemwideinterfaces.core.IContext context, java.math.BigDecimal decimalvalue)
	{
		getMendixObject().setValue(context, MemberNames.DecimalValue.toString(), decimalvalue);
	}

	/**
	 * Set value of DeviceType
	 * @param devicetype
	 */
	public final system.proxies.DeviceType getDeviceType()
	{
		return getDeviceType(getContext());
	}

	/**
	 * @param context
	 * @return value of DeviceType
	 */
	public final system.proxies.DeviceType getDeviceType(com.mendix.systemwideinterfaces.core.IContext context)
	{
		Object obj = getMendixObject().getValue(context, MemberNames.DeviceType.toString());
		if (obj == null)
			return null;

		return system.proxies.DeviceType.valueOf((java.lang.String) obj);
	}

	/**
	 * Set value of DeviceType
	 * @param devicetype
	 */
	public final void setDeviceType(system.proxies.DeviceType devicetype)
	{
		setDeviceType(getContext(), devicetype);
	}

	/**
	 * Set value of DeviceType
	 * @param context
	 * @param devicetype
	 */
	public final void setDeviceType(com.mendix.systemwideinterfaces.core.IContext context, system.proxies.DeviceType devicetype)
	{
		if (devicetype != null)
			getMendixObject().setValue(context, MemberNames.DeviceType.toString(), devicetype.toString());
		else
			getMendixObject().setValue(context, MemberNames.DeviceType.toString(), null);
	}

	/**
	 * @return value of FloatValue
	 */
	public final java.lang.Double getFloatValue()
	{
		return getFloatValue(getContext());
	}

	/**
	 * @param context
	 * @return value of FloatValue
	 */
	public final java.lang.Double getFloatValue(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Double) getMendixObject().getValue(context, MemberNames.FloatValue.toString());
	}

	/**
	 * Set value of FloatValue
	 * @param floatvalue
	 */
	public final void setFloatValue(java.lang.Double floatvalue)
	{
		setFloatValue(getContext(), floatvalue);
	}

	/**
	 * Set value of FloatValue
	 * @param context
	 * @param floatvalue
	 */
	public final void setFloatValue(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Double floatvalue)
	{
		getMendixObject().setValue(context, MemberNames.FloatValue.toString(), floatvalue);
	}

	/**
	 * @return value of IntegerValue
	 */
	public final java.lang.Integer getIntegerValue()
	{
		return getIntegerValue(getContext());
	}

	/**
	 * @param context
	 * @return value of IntegerValue
	 */
	public final java.lang.Integer getIntegerValue(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Integer) getMendixObject().getValue(context, MemberNames.IntegerValue.toString());
	}

	/**
	 * Set value of IntegerValue
	 * @param integervalue
	 */
	public final void setIntegerValue(java.lang.Integer integervalue)
	{
		setIntegerValue(getContext(), integervalue);
	}

	/**
	 * Set value of IntegerValue
	 * @param context
	 * @param integervalue
	 */
	public final void setIntegerValue(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Integer integervalue)
	{
		getMendixObject().setValue(context, MemberNames.IntegerValue.toString(), integervalue);
	}

	/**
	 * @return value of LongValue
	 */
	public final java.lang.Long getLongValue()
	{
		return getLongValue(getContext());
	}

	/**
	 * @param context
	 * @return value of LongValue
	 */
	public final java.lang.Long getLongValue(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Long) getMendixObject().getValue(context, MemberNames.LongValue.toString());
	}

	/**
	 * Set value of LongValue
	 * @param longvalue
	 */
	public final void setLongValue(java.lang.Long longvalue)
	{
		setLongValue(getContext(), longvalue);
	}

	/**
	 * Set value of LongValue
	 * @param context
	 * @param longvalue
	 */
	public final void setLongValue(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Long longvalue)
	{
		getMendixObject().setValue(context, MemberNames.LongValue.toString(), longvalue);
	}

	/**
	 * @return value of CurrencyValue
	 */
	public final java.lang.Double getCurrencyValue()
	{
		return getCurrencyValue(getContext());
	}

	/**
	 * @param context
	 * @return value of CurrencyValue
	 */
	public final java.lang.Double getCurrencyValue(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Double) getMendixObject().getValue(context, MemberNames.CurrencyValue.toString());
	}

	/**
	 * Set value of CurrencyValue
	 * @param currencyvalue
	 */
	public final void setCurrencyValue(java.lang.Double currencyvalue)
	{
		setCurrencyValue(getContext(), currencyvalue);
	}

	/**
	 * Set value of CurrencyValue
	 * @param context
	 * @param currencyvalue
	 */
	public final void setCurrencyValue(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Double currencyvalue)
	{
		getMendixObject().setValue(context, MemberNames.CurrencyValue.toString(), currencyvalue);
	}

	/**
	 * @return the IMendixObject instance of this proxy for use in the Core interface.
	 */
	public final com.mendix.systemwideinterfaces.core.IMendixObject getMendixObject()
	{
		return testDataTypesMendixObject;
	}

	/**
	 * @return the IContext instance of this proxy, or null if no IContext instance was specified at initialization.
	 */
	public final com.mendix.systemwideinterfaces.core.IContext getContext()
	{
		return context;
	}

	@java.lang.Override
	public boolean equals(Object obj)
	{
		if (obj == this)
			return true;

		if (obj != null && getClass().equals(obj.getClass()))
		{
			final datatablestestmodule.proxies.TestDataTypes that = (datatablestestmodule.proxies.TestDataTypes) obj;
			return getMendixObject().equals(that.getMendixObject());
		}
		return false;
	}

	@java.lang.Override
	public int hashCode()
	{
		return getMendixObject().hashCode();
	}

	/**
	 * @return String name of this class
	 */
	public static java.lang.String getType()
	{
		return "DataTablesTestModule.TestDataTypes";
	}

	/**
	 * @return String GUID from this object, format: ID_0000000000
	 * @deprecated Use getMendixObject().getId().toLong() to get a unique identifier for this object.
	 */
	@java.lang.Deprecated
	public java.lang.String getGUID()
	{
		return "ID_" + getMendixObject().getId().toLong();
	}
}
