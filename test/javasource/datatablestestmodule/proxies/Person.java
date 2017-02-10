// This file was generated by Mendix Modeler.
//
// WARNING: Code you write here will be lost the next time you deploy the project.

package datatablestestmodule.proxies;

public class Person
{
	private final com.mendix.systemwideinterfaces.core.IMendixObject personMendixObject;

	private final com.mendix.systemwideinterfaces.core.IContext context;

	/**
	 * Internal name of this entity
	 */
	public static final java.lang.String entityName = "DataTablesTestModule.Person";

	/**
	 * Enum describing members of this entity
	 */
	public enum MemberNames
	{
		Number("Number"),
		gender("gender"),
		firstName("firstName"),
		lastName("lastName"),
		email("email"),
		address("address"),
		city("city"),
		countryCode("countryCode"),
		phone("phone"),
		salary("salary"),
		Person_Country("DataTablesTestModule.Person_Country");

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

	public Person(com.mendix.systemwideinterfaces.core.IContext context)
	{
		this(context, com.mendix.core.Core.instantiate(context, "DataTablesTestModule.Person"));
	}

	protected Person(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject personMendixObject)
	{
		if (personMendixObject == null)
			throw new java.lang.IllegalArgumentException("The given object cannot be null.");
		if (!com.mendix.core.Core.isSubClassOf("DataTablesTestModule.Person", personMendixObject.getType()))
			throw new java.lang.IllegalArgumentException("The given object is not a DataTablesTestModule.Person");

		this.personMendixObject = personMendixObject;
		this.context = context;
	}

	/**
	 * @deprecated Use 'Person.load(IContext, IMendixIdentifier)' instead.
	 */
	@Deprecated
	public static datatablestestmodule.proxies.Person initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		return datatablestestmodule.proxies.Person.load(context, mendixIdentifier);
	}

	/**
	 * Initialize a proxy using context (recommended). This context will be used for security checking when the get- and set-methods without context parameters are called.
	 * The get- and set-methods with context parameter should be used when for instance sudo access is necessary (IContext.getSudoContext() can be used to obtain sudo access).
	 */
	public static datatablestestmodule.proxies.Person initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject mendixObject)
	{
		return new datatablestestmodule.proxies.Person(context, mendixObject);
	}

	public static datatablestestmodule.proxies.Person load(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		com.mendix.systemwideinterfaces.core.IMendixObject mendixObject = com.mendix.core.Core.retrieveId(context, mendixIdentifier);
		return datatablestestmodule.proxies.Person.initialize(context, mendixObject);
	}

	public static java.util.List<datatablestestmodule.proxies.Person> load(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String xpathConstraint) throws com.mendix.core.CoreException
	{
		java.util.List<datatablestestmodule.proxies.Person> result = new java.util.ArrayList<datatablestestmodule.proxies.Person>();
		for (com.mendix.systemwideinterfaces.core.IMendixObject obj : com.mendix.core.Core.retrieveXPathQuery(context, "//DataTablesTestModule.Person" + xpathConstraint))
			result.add(datatablestestmodule.proxies.Person.initialize(context, obj));
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
	 * @return value of Number
	 */
	public final java.lang.Long getNumber()
	{
		return getNumber(getContext());
	}

	/**
	 * @param context
	 * @return value of Number
	 */
	public final java.lang.Long getNumber(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Long) getMendixObject().getValue(context, MemberNames.Number.toString());
	}

	/**
	 * Set value of Number
	 * @param number
	 */
	public final void setNumber(java.lang.Long number)
	{
		setNumber(getContext(), number);
	}

	/**
	 * Set value of Number
	 * @param context
	 * @param number
	 */
	public final void setNumber(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Long number)
	{
		getMendixObject().setValue(context, MemberNames.Number.toString(), number);
	}

	/**
	 * Set value of gender
	 * @param gender
	 */
	public final datatablestestmodule.proxies.Gender getgender()
	{
		return getgender(getContext());
	}

	/**
	 * @param context
	 * @return value of gender
	 */
	public final datatablestestmodule.proxies.Gender getgender(com.mendix.systemwideinterfaces.core.IContext context)
	{
		Object obj = getMendixObject().getValue(context, MemberNames.gender.toString());
		if (obj == null)
			return null;

		return datatablestestmodule.proxies.Gender.valueOf((java.lang.String) obj);
	}

	/**
	 * Set value of gender
	 * @param gender
	 */
	public final void setgender(datatablestestmodule.proxies.Gender gender)
	{
		setgender(getContext(), gender);
	}

	/**
	 * Set value of gender
	 * @param context
	 * @param gender
	 */
	public final void setgender(com.mendix.systemwideinterfaces.core.IContext context, datatablestestmodule.proxies.Gender gender)
	{
		if (gender != null)
			getMendixObject().setValue(context, MemberNames.gender.toString(), gender.toString());
		else
			getMendixObject().setValue(context, MemberNames.gender.toString(), null);
	}

	/**
	 * @return value of firstName
	 */
	public final java.lang.String getfirstName()
	{
		return getfirstName(getContext());
	}

	/**
	 * @param context
	 * @return value of firstName
	 */
	public final java.lang.String getfirstName(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.firstName.toString());
	}

	/**
	 * Set value of firstName
	 * @param firstname
	 */
	public final void setfirstName(java.lang.String firstname)
	{
		setfirstName(getContext(), firstname);
	}

	/**
	 * Set value of firstName
	 * @param context
	 * @param firstname
	 */
	public final void setfirstName(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String firstname)
	{
		getMendixObject().setValue(context, MemberNames.firstName.toString(), firstname);
	}

	/**
	 * @return value of lastName
	 */
	public final java.lang.String getlastName()
	{
		return getlastName(getContext());
	}

	/**
	 * @param context
	 * @return value of lastName
	 */
	public final java.lang.String getlastName(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.lastName.toString());
	}

	/**
	 * Set value of lastName
	 * @param lastname
	 */
	public final void setlastName(java.lang.String lastname)
	{
		setlastName(getContext(), lastname);
	}

	/**
	 * Set value of lastName
	 * @param context
	 * @param lastname
	 */
	public final void setlastName(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String lastname)
	{
		getMendixObject().setValue(context, MemberNames.lastName.toString(), lastname);
	}

	/**
	 * @return value of email
	 */
	public final java.lang.String getemail()
	{
		return getemail(getContext());
	}

	/**
	 * @param context
	 * @return value of email
	 */
	public final java.lang.String getemail(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.email.toString());
	}

	/**
	 * Set value of email
	 * @param email
	 */
	public final void setemail(java.lang.String email)
	{
		setemail(getContext(), email);
	}

	/**
	 * Set value of email
	 * @param context
	 * @param email
	 */
	public final void setemail(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String email)
	{
		getMendixObject().setValue(context, MemberNames.email.toString(), email);
	}

	/**
	 * @return value of address
	 */
	public final java.lang.String getaddress()
	{
		return getaddress(getContext());
	}

	/**
	 * @param context
	 * @return value of address
	 */
	public final java.lang.String getaddress(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.address.toString());
	}

	/**
	 * Set value of address
	 * @param address
	 */
	public final void setaddress(java.lang.String address)
	{
		setaddress(getContext(), address);
	}

	/**
	 * Set value of address
	 * @param context
	 * @param address
	 */
	public final void setaddress(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String address)
	{
		getMendixObject().setValue(context, MemberNames.address.toString(), address);
	}

	/**
	 * @return value of city
	 */
	public final java.lang.String getcity()
	{
		return getcity(getContext());
	}

	/**
	 * @param context
	 * @return value of city
	 */
	public final java.lang.String getcity(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.city.toString());
	}

	/**
	 * Set value of city
	 * @param city
	 */
	public final void setcity(java.lang.String city)
	{
		setcity(getContext(), city);
	}

	/**
	 * Set value of city
	 * @param context
	 * @param city
	 */
	public final void setcity(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String city)
	{
		getMendixObject().setValue(context, MemberNames.city.toString(), city);
	}

	/**
	 * @return value of countryCode
	 */
	public final java.lang.String getcountryCode()
	{
		return getcountryCode(getContext());
	}

	/**
	 * @param context
	 * @return value of countryCode
	 */
	public final java.lang.String getcountryCode(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.countryCode.toString());
	}

	/**
	 * Set value of countryCode
	 * @param countrycode
	 */
	public final void setcountryCode(java.lang.String countrycode)
	{
		setcountryCode(getContext(), countrycode);
	}

	/**
	 * Set value of countryCode
	 * @param context
	 * @param countrycode
	 */
	public final void setcountryCode(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String countrycode)
	{
		getMendixObject().setValue(context, MemberNames.countryCode.toString(), countrycode);
	}

	/**
	 * @return value of phone
	 */
	public final java.lang.String getphone()
	{
		return getphone(getContext());
	}

	/**
	 * @param context
	 * @return value of phone
	 */
	public final java.lang.String getphone(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.phone.toString());
	}

	/**
	 * Set value of phone
	 * @param phone
	 */
	public final void setphone(java.lang.String phone)
	{
		setphone(getContext(), phone);
	}

	/**
	 * Set value of phone
	 * @param context
	 * @param phone
	 */
	public final void setphone(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String phone)
	{
		getMendixObject().setValue(context, MemberNames.phone.toString(), phone);
	}

	/**
	 * @return value of salary
	 */
	public final java.math.BigDecimal getsalary()
	{
		return getsalary(getContext());
	}

	/**
	 * @param context
	 * @return value of salary
	 */
	public final java.math.BigDecimal getsalary(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.math.BigDecimal) getMendixObject().getValue(context, MemberNames.salary.toString());
	}

	/**
	 * Set value of salary
	 * @param salary
	 */
	public final void setsalary(java.math.BigDecimal salary)
	{
		setsalary(getContext(), salary);
	}

	/**
	 * Set value of salary
	 * @param context
	 * @param salary
	 */
	public final void setsalary(com.mendix.systemwideinterfaces.core.IContext context, java.math.BigDecimal salary)
	{
		getMendixObject().setValue(context, MemberNames.salary.toString(), salary);
	}

	/**
	 * @return value of Person_Country
	 */
	public final datatablestestmodule.proxies.Country getPerson_Country() throws com.mendix.core.CoreException
	{
		return getPerson_Country(getContext());
	}

	/**
	 * @param context
	 * @return value of Person_Country
	 */
	public final datatablestestmodule.proxies.Country getPerson_Country(com.mendix.systemwideinterfaces.core.IContext context) throws com.mendix.core.CoreException
	{
		datatablestestmodule.proxies.Country result = null;
		com.mendix.systemwideinterfaces.core.IMendixIdentifier identifier = getMendixObject().getValue(context, MemberNames.Person_Country.toString());
		if (identifier != null)
			result = datatablestestmodule.proxies.Country.load(context, identifier);
		return result;
	}

	/**
	 * Set value of Person_Country
	 * @param person_country
	 */
	public final void setPerson_Country(datatablestestmodule.proxies.Country person_country)
	{
		setPerson_Country(getContext(), person_country);
	}

	/**
	 * Set value of Person_Country
	 * @param context
	 * @param person_country
	 */
	public final void setPerson_Country(com.mendix.systemwideinterfaces.core.IContext context, datatablestestmodule.proxies.Country person_country)
	{
		if (person_country == null)
			getMendixObject().setValue(context, MemberNames.Person_Country.toString(), null);
		else
			getMendixObject().setValue(context, MemberNames.Person_Country.toString(), person_country.getMendixObject().getId());
	}

	/**
	 * @return the IMendixObject instance of this proxy for use in the Core interface.
	 */
	public final com.mendix.systemwideinterfaces.core.IMendixObject getMendixObject()
	{
		return personMendixObject;
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
			final datatablestestmodule.proxies.Person that = (datatablestestmodule.proxies.Person) obj;
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
		return "DataTablesTestModule.Person";
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
