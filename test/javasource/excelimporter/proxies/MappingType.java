// This file was generated by Mendix Modeler.
//
// WARNING: Code you write here will be lost the next time you deploy the project.

package excelimporter.proxies;

public enum MappingType
{
	Attribute(new java.lang.String[][] { new java.lang.String[] { "en_US", "Attribute" }, new java.lang.String[] { "nl_NL", "Attribuut" }, new java.lang.String[] { "en_GB", "Attribute" }, new java.lang.String[] { "en_ZA", "Attribute" } }),
	Reference(new java.lang.String[][] { new java.lang.String[] { "en_US", "Reference" }, new java.lang.String[] { "nl_NL", "Referentie" }, new java.lang.String[] { "en_GB", "Reference" }, new java.lang.String[] { "en_ZA", "Reference" } }),
	DoNotUse(new java.lang.String[][] { new java.lang.String[] { "en_US", "Do not use" }, new java.lang.String[] { "nl_NL", "Niet gebruiken" }, new java.lang.String[] { "en_GB", "Do not use" }, new java.lang.String[] { "en_ZA", "Do not use" } });

	private java.util.Map<java.lang.String, java.lang.String> captions;

	private MappingType(java.lang.String[][] captionStrings)
	{
		this.captions = new java.util.HashMap<java.lang.String, java.lang.String>();
		for (java.lang.String[] captionString : captionStrings)
			captions.put(captionString[0], captionString[1]);
	}

	public java.lang.String getCaption(java.lang.String languageCode)
	{
		if (captions.containsKey(languageCode))
			return captions.get(languageCode);
		return captions.get("en_US");
	}

	public java.lang.String getCaption()
	{
		return captions.get("en_US");
	}
}
