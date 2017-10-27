package datatablesexportdata;

import java.io.BufferedInputStream;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

import com.mendix.core.Core;
import com.mendix.core.CoreException;
import com.mendix.logging.ILogNode;
import com.mendix.systemwideinterfaces.core.IContext;
import com.mendix.systemwideinterfaces.core.IMendixObject;
import com.mendix.systemwideinterfaces.core.meta.IMetaEnumValue;
import com.mendix.systemwideinterfaces.core.meta.IMetaEnumeration;
import com.mendix.systemwideinterfaces.core.meta.IMetaPrimitive;
import com.mendix.systemwideinterfaces.core.meta.IMetaPrimitive.PrimitiveType;

import communitycommons.StringUtils;
import datatablesexportdata.proxies.DataTablesExportDocument;
import datatablesexportdata.proxies.constants.Constants;

public class ExportDataImpl {

	private static final String TAG_SORT_DIR = "dir";
	private static final String TAG_SORT_NAME = "name";
	private static final String TAG_SORT_DATA = "sortData";
	private static final String TAG_TABLE_ENTITY = "tableEntity";
	private static final String TAG_ATTR_NAME = "attrName";
	private static final String TAG_CAPTION = "caption";
	private static final String TAG_COLUMNS = "columns";
	private static final String TAG_DATE_FORMAT = "dateFormat";
	private static final String TAG_DATE_TIME_FORMAT = "dateTimeFormat";
	private static final String TAG_DATE_TIME_TYPE = "dateTimeType";
	private static final String TAG_DECIMAL_POSITIONS = "decimalPositions";
	private static final String TAG_GROUP_DIGITS = "groupDigits";
	private static final String TAG_REF_NAME = "refName";
	private static final String TAG_TIME_FORMAT = "timeFormat";
	private static final String TAG_VISIBLE = "visible";
	
	private final String CLASS_NAME = getClass().getSimpleName();	
	private final IContext context;
	private final ILogNode logger = Core.getLogger(Constants.getLOGNODE_DATATABLES_EXPORT());

	private final String exportConfig;
	private final String xpath;
	private final int limit; 
	
	private String languageCode;
	private Locale locale;
	private File tempFile;
	private Writer tempFileWriter;
	private final List<ExportDataColumn> columnList = new ArrayList<>();
	private Map<String, SimpleDateFormat> dateFormatterMap = new HashMap<>();
	private DecimalFormat decimalFormat;
	private int offset = 0;
	private JSONObject jsonObject;
	private DataTablesExportDocument exportDocument = null;
	private String entityName;
	Map<String, String> sortMap = new HashMap<>();

	
	public ExportDataImpl(IContext context, String exportConfig, String xpath, Long limit) {
		this.context = context;
		this.exportConfig = exportConfig;
		this.xpath = xpath;
		if (limit != null) {
			this.limit = limit.intValue();
		} else {
			this.limit = 1000;
		}
	}
		
	public DataTablesExportDocument export() {
		String logPrefix = CLASS_NAME + ".export ";
		if (logger.isTraceEnabled()) {
			logger.trace(logPrefix + "start");
		}		
		
		try {
			
			initialize();
			
			writeHeaderToCsv();
						
			// Retrieve first batch
			List<IMendixObject> objectList = retrieveDataBatch();
			while (objectList != null && !objectList.isEmpty()) {
				
				// Write the batch to the output file
				writeBatchToCsv(objectList);
				
				// Retrieve next batch
				offset += objectList.size();
				objectList = retrieveDataBatch();
			}

			tempFileWriter.close();
			
			Core.storeFileDocumentContent(context, exportDocument.getMendixObject(), new BufferedInputStream(new FileInputStream(tempFile)));
			
			try {
				if (tempFile.delete()) {
					if (logger.isTraceEnabled()) {
						logger.trace(logPrefix + "Temp file deleted");
					}		
				} else {
					if (logger.isTraceEnabled()) {
						logger.trace(logPrefix + "Temp file not deleted");
					}		
				}
			} catch (Exception deleteException) {
				if (logger.isTraceEnabled()) {
					logger.trace(logPrefix + "Temp file not deleted, exception message: " + deleteException.getMessage());
				}		
			}
		} catch (Exception e) {
			logger.error(e);
			throw new RuntimeException(e);			
		}
		return exportDocument;
	}
	
	private void initialize() throws IOException {
		String logPrefix = CLASS_NAME + ".initialize ";
		if (logger.isTraceEnabled()) {
			logger.trace(logPrefix + "start");
		}		

		languageCode = context.getSession().getLanguage().getCode();
		locale = Locale.forLanguageTag(languageCode.substring(0,2));
		decimalFormat = new DecimalFormat();
		decimalFormat.setDecimalFormatSymbols(new DecimalFormatSymbols(locale));
		decimalFormat.setGroupingUsed(false); // No grouping, Excel will take care of this.
		
		jsonObject = new JSONObject(exportConfig);
		
		entityName = jsonObject.getString(TAG_TABLE_ENTITY);
		JSONArray sortData = jsonObject.getJSONArray(TAG_SORT_DATA);
		for (JSONObject sortItemObject : sortData.toJSONObjectCollection()) {
			sortMap.put(sortItemObject.getString(TAG_SORT_NAME), sortItemObject.getString(TAG_SORT_DIR));
		}		

		exportDocument = new DataTablesExportDocument(context);
		exportDocument.setDeleteAfterDownload(true);
		exportDocument.setName("export.csv");

		tempFile = File.createTempFile(StringUtils.randomString(15), ".tmp");
		tempFile.deleteOnExit();
		tempFileWriter = new BufferedWriter(new FileWriter(tempFile));
		
		JSONArray columns = jsonObject.getJSONArray(TAG_COLUMNS);
		for (JSONObject column : columns.toJSONObjectCollection()) {
			final String caption = column.getString(TAG_CAPTION);
			final String attrName = column.getString(TAG_ATTR_NAME);
			final String refName = column.getString(TAG_REF_NAME);
			final String dateTimeType = column.getString(TAG_DATE_TIME_TYPE);
			final String dateFormat = column.getString(TAG_DATE_FORMAT);
			final String dateTimeFormat = column.getString(TAG_DATE_TIME_FORMAT);
			final String timeFormat = column.getString(TAG_TIME_FORMAT);
			final boolean groupDigits = column.getBoolean(TAG_GROUP_DIGITS);
			final int decimalPositions = column.getInt(TAG_DECIMAL_POSITIONS);
			final boolean visible = column.getBoolean(TAG_VISIBLE);
			ExportDataColumn exportDataColumn = new ExportDataColumn();
			exportDataColumn.setCaption(caption);
			exportDataColumn.setAttrName(attrName);
			exportDataColumn.setRefName(refName);
			exportDataColumn.setDateTimeType(dateTimeType);
			exportDataColumn.setDateFormat(dateFormat);
			exportDataColumn.setDateTimeFormat(dateTimeFormat);
			exportDataColumn.setTimeFormat(timeFormat);
			exportDataColumn.setGroupDigits(groupDigits);
			exportDataColumn.setDecimalPositions(decimalPositions);
			exportDataColumn.setVisible(visible);
			if (exportDataColumn.getRefName() != null && exportDataColumn.getRefName().trim().length() > 0) {
				exportDataColumn.setFullRefName(exportDataColumn.getRefName().trim() + "." + exportDataColumn.getAttrName());
				exportDataColumn.setReference(true);
			} else {
				exportDataColumn.setReference(false);
			}
			columnList.add(exportDataColumn);
		}
	}
	
	private void writeHeaderToCsv() throws IOException {
		String logPrefix = CLASS_NAME + ".writeCsvHeader ";
		if (logger.isTraceEnabled()) {
			logger.trace(logPrefix + "start");
		}		

		String customHeader = Constants.getCSV_EXPORT_HEADER();
		if (customHeader != null && !customHeader.trim().isEmpty()) {
			tempFileWriter.write(customHeader + "\r\n");
		}
		
		boolean firstColumnHeader = true;
		for (ExportDataColumn exportDataColumn : columnList) {
			String columnHeader = "\"" + exportDataColumn.getCaption() + "\"";
			if (!firstColumnHeader) {
				columnHeader = ";" + columnHeader;
			}
			tempFileWriter.write(columnHeader);
			firstColumnHeader = false;
		}
		tempFileWriter.write("\r\n");
	}

	private List<IMendixObject> retrieveDataBatch() throws CoreException {
		String logPrefix = CLASS_NAME + ".retrieveDataBatch ";
		if (logger.isTraceEnabled()) {
			logger.trace(logPrefix + "start");
		}		
		if (logger.isDebugEnabled()) {
			logger.debug(logPrefix + "Offset: " + offset + ", limit: " + limit);
			logger.debug(logPrefix + "XPath: " + xpath);
		}		
		List<IMendixObject> objectList = Core.retrieveXPathQuery(context, xpath, limit, offset, sortMap);
		if (logger.isDebugEnabled()) {
			if (objectList != null) {
				logger.trace(logPrefix + "Retrieved " + objectList.size() + " object(s)");
			} else {
				logger.trace(logPrefix + "No objects found");
			}
		}		
		return objectList;
	}
	
	private void writeBatchToCsv(List<IMendixObject> objectList) throws IOException {
		String logPrefix = CLASS_NAME + ".writeBatchToCsv ";
		if (logger.isTraceEnabled()) {
			logger.trace(logPrefix + "start");
		}		
		
		for (IMendixObject object : objectList) {
			writeObjectToCsv(object);
		}
	}
	
	private void writeObjectToCsv(IMendixObject object) throws IOException {
		String logPrefix = CLASS_NAME + ".writeObjectToCsv ";
		if (logger.isTraceEnabled()) {
			logger.trace(logPrefix + "start");
		}		
		
		boolean firstColumn = true;
		for (ExportDataColumn exportDataColumn : columnList) {
			Object objectValue = null;
			IMetaPrimitive metaPrimitive = null;
			if (exportDataColumn.isReference()) {
				if (logger.isTraceEnabled()) {
					logger.trace(logPrefix + "Reference: " + exportDataColumn.getFullRefName());
				}
				// This relies on the business server cache, no smart stuff here.
				List<IMendixObject> retrieveByAssociationList = Core.retrieveByPath(context, object, exportDataColumn.getRefName());
				if (retrieveByAssociationList != null && !retrieveByAssociationList.isEmpty()) {
					IMendixObject referencedObject = retrieveByAssociationList.get(0);
					objectValue = referencedObject.getValue(context, exportDataColumn.getAttrName());
					metaPrimitive = referencedObject.getMetaObject().getMetaPrimitive(exportDataColumn.getAttrName());
				}
			} else {
				if (logger.isTraceEnabled()) {
					logger.trace(logPrefix + "Attribute: " + exportDataColumn.getAttrName());
				}		
				objectValue = object.getValue(context, exportDataColumn.getAttrName());
				metaPrimitive = object.getMetaObject().getMetaPrimitive(exportDataColumn.getAttrName());
			}
			String stringValue;
			if (logger.isTraceEnabled()) {
				if (objectValue == null) {
					logger.trace(logPrefix + "Object value is null");
				}
				if (metaPrimitive == null) {
					logger.trace(logPrefix + "Meta primitive is null");
				}
			}		
			if (objectValue != null && metaPrimitive != null) {
				PrimitiveType attrType = metaPrimitive.getType();
				switch (attrType) {
				case AutoNumber:
				case Integer:
				case Long:
				case Boolean:
					stringValue = objectValue.toString();
					break;

				case Enum:
					stringValue = objectValue.toString();
					IMetaEnumeration metaEnum = metaPrimitive.getEnumeration();
					// This results in the English version only.
					Map<String, IMetaEnumValue> enumMap = metaEnum.getEnumValues();
					if (enumMap.containsKey(stringValue)) {
						IMetaEnumValue enumValue = enumMap.get(stringValue);
						String enumCaption =  Core.getInternationalizedString(context, enumValue.getI18NCaptionKey());
						stringValue = "\"" + enumCaption + "\"";
					}
					break;

				case String:
					stringValue = "\"" + objectValue.toString() + "\"";
					break;

				case Float:
				case Currency:
					Double doubleValue = (Double) objectValue;
					stringValue = String.format(locale, "%+1." + exportDataColumn.getDecimalPositions() + "f", doubleValue);
					break;					

				case Decimal:
					BigDecimal decimal = (BigDecimal) objectValue;
					decimalFormat.setMinimumFractionDigits(exportDataColumn.getDecimalPositions());
					decimalFormat.setMaximumFractionDigits(exportDataColumn.getDecimalPositions());
					stringValue = decimalFormat.format(decimal);
					break;					

				case DateTime:
					
					stringValue = "\"" + getDateFormatter(exportDataColumn).format(objectValue) + "\"";
					break;					
					
				default:
					stringValue = "\"\""; // Just an empty string, not supported
					break;
				}
			} else {
				stringValue = "";
			}
			
			if (!firstColumn) {
				stringValue = ";" + stringValue;
			}
			tempFileWriter.write(stringValue);
			firstColumn = false;
		}
		tempFileWriter.write("\r\n");
	}
	
	private SimpleDateFormat getDateFormatter(ExportDataColumn exportDataColumn) {
		String logPrefix = CLASS_NAME + ".getDateFormatter ";
		if (logger.isTraceEnabled()) {
			logger.trace(logPrefix + "start");
		}		
		
		// Attempt to find a formatter for this attribute, create one if not found.
		final String mapKey;
		if (exportDataColumn.isReference()) {
			mapKey = exportDataColumn.getFullRefName();
		} else {
			mapKey = exportDataColumn.getAttrName();
		}
		
		SimpleDateFormat formatter;
		if (dateFormatterMap.containsKey(mapKey)) {
			formatter = dateFormatterMap.get(mapKey);			
			if (logger.isTraceEnabled()) {
				logger.trace(logPrefix + "Found existing formatter for map key " + mapKey);
			}		
		} else {
			String pattern;
			switch (exportDataColumn.getDateTimeType()) {
			case "dateTime":
				pattern = exportDataColumn.getDateTimeFormat();
				break;

			case "time":
				pattern = exportDataColumn.getTimeFormat();
				break;

			default:
				pattern = exportDataColumn.getDateFormat();
				break;
			}
			formatter = new SimpleDateFormat(pattern);
			dateFormatterMap.put(mapKey, formatter);
			if (logger.isTraceEnabled()) {
				logger.trace(logPrefix + "Created new formatter for map key " + mapKey);
			}		
		}
		
		return formatter;
	}
	
}
