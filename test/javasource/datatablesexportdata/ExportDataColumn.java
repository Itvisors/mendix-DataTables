package datatablesexportdata;

public class ExportDataColumn {

	private String caption;
	private String attrName;
	private boolean reference;
	private String refName;
	private String fullRefName;
	private String dateTimeType;
	private String dateFormat;
	private String dateTimeFormat;
	private String timeFormat;
	private boolean groupDigits;
	private int decimalPositions;
	private boolean visible;

	public String getCaption() {
		return caption;
	}

	public void setCaption(String caption) {
		this.caption = caption;
	}

	public String getAttrName() {
		return attrName;
	}

	public void setAttrName(String attrName) {
		this.attrName = attrName;
	}

	public boolean isReference() {
		return reference;
	}

	public void setReference(boolean reference) {
		this.reference = reference;
	}

	public String getRefName() {
		return refName;
	}

	public void setRefName(String refName) {
		this.refName = refName;
	}

	public String getFullRefName() {
		return fullRefName;
	}

	public void setFullRefName(String fullRefName) {
		this.fullRefName = fullRefName;
	}

	public String getDateTimeType() {
		return dateTimeType;
	}

	public void setDateTimeType(String dateTimeType) {
		this.dateTimeType = dateTimeType;
	}

	public String getDateFormat() {
		return dateFormat;
	}

	public void setDateFormat(String dateFormat) {
		this.dateFormat = dateFormat;
	}

	public String getDateTimeFormat() {
		return dateTimeFormat;
	}

	public void setDateTimeFormat(String dateTimeFormat) {
		this.dateTimeFormat = dateTimeFormat;
	}

	public String getTimeFormat() {
		return timeFormat;
	}

	public void setTimeFormat(String timeFormat) {
		this.timeFormat = timeFormat;
	}

	public boolean isGroupDigits() {
		return groupDigits;
	}

	public void setGroupDigits(boolean groupDigits) {
		this.groupDigits = groupDigits;
	}

	public int getDecimalPositions() {
		return decimalPositions;
	}

	public void setDecimalPositions(int decimalPositions) {
		this.decimalPositions = decimalPositions;
	}

	public boolean isVisible() {
		return visible;
	}

	public void setVisible(boolean visible) {
		this.visible = visible;
	}

}
