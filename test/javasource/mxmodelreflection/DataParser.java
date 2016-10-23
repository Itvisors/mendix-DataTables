/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package mxmodelreflection;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import com.mendix.core.Core;
import com.mendix.core.CoreException;
import com.mendix.core.objectmanagement.member.MendixAutoNumber;
import com.mendix.core.objectmanagement.member.MendixBoolean;
import com.mendix.core.objectmanagement.member.MendixCurrency;
import com.mendix.core.objectmanagement.member.MendixDateTime;
import com.mendix.core.objectmanagement.member.MendixDecimal;
import com.mendix.core.objectmanagement.member.MendixEnum;
import com.mendix.core.objectmanagement.member.MendixFloat;
import com.mendix.core.objectmanagement.member.MendixHashString;
import com.mendix.core.objectmanagement.member.MendixInteger;
import com.mendix.core.objectmanagement.member.MendixLong;
import com.mendix.core.objectmanagement.member.MendixString;
import com.mendix.systemwideinterfaces.core.IContext;
import com.mendix.systemwideinterfaces.core.IMendixObjectMember;
import com.mendix.systemwideinterfaces.core.ISession;
import com.mendix.systemwideinterfaces.core.meta.IMetaEnumValue;

public class DataParser
{

	public static String getStringValue( Object value, IContext context ) throws CoreException
	{
		if ( value == null ) {
			return "";
		}

		else if ( value instanceof Integer ) {
			TokenReplacer._logger.trace("Processing value as integer");
			return Integer.toString((Integer) value);
		}
		else if ( value instanceof Boolean ) {
			TokenReplacer._logger.trace("Processing value as Boolean");
			return Boolean.toString((Boolean) value);
		}
		else if ( value instanceof Double ) {
			TokenReplacer._logger.trace("Processing value as double");
			return getFormattedNumber(context, (Double) value, 2, 20);
		}
		else if ( value instanceof Float ) {
			TokenReplacer._logger.trace("Processing value as float");
			return getFormattedNumber(context, Double.valueOf((Float) value), 2, 20);
		}
		else if ( value instanceof Date ) {
			TokenReplacer._logger.trace("Processing value as date, localized");
			return processDate(context, (Date) value, true);
		}
		else if ( value instanceof Long ) {
			TokenReplacer._logger.trace("Processing value as long");
			return Long.toString((Long) value);
		}
		else if ( value instanceof BigDecimal ) {
			TokenReplacer._logger.trace("Processing value as Big Decimal");
			return ((BigDecimal) value).toString();
		}
		else if ( value instanceof IMendixObjectMember ) {
			IMendixObjectMember<?> member = (IMendixObjectMember<?>) value;
			if ( member.getValue(context) == null ) {
				TokenReplacer._logger.trace("MendixObjectMember has no content");
				return "";
			}

			if ( value instanceof MendixBoolean ) {
				TokenReplacer._logger.trace("Processing value as MendixBoolean");
				return Boolean.toString(((MendixBoolean) value).getValue(context));
			}
			else if ( value instanceof MendixCurrency ) {
				TokenReplacer._logger.trace("Processing value as MendixCurrency");
				return getFormattedNumber(context, ((MendixCurrency) value).getValue(context), 2, 2);
			}
			else if ( value instanceof MendixDateTime ) {
				TokenReplacer._logger.trace("Processing value as MendixDateTime");
				return processDate(context, ((MendixDateTime) value).getValue(context), ((MendixDateTime) value).shouldLocalize());
			}
			else if ( value instanceof MendixEnum ) {
				TokenReplacer._logger.trace("Processing value as MendixEnum");
				MendixEnum enumeration = (MendixEnum) value;
				try {
					IMetaEnumValue enumValue = enumeration.getEnumeration().getEnumValues().get(enumeration.getValue(context));
					return Core.getInternationalizedString(context, enumValue.getI18NCaptionKey());
				}
				catch( Exception e ) {
					Core.getLogger("TokenReplacer").warn(e);
					return enumeration.getValue(context);
				}
			}
			else if ( value instanceof MendixFloat ) {
				TokenReplacer._logger.trace("Processing value as MendixFloat");
				return Double.toString(((MendixFloat) value).getValue(context));
			}
			else if ( value instanceof MendixDecimal ) {
				TokenReplacer._logger.trace("Processing value as MendixDecimal");
				BigDecimal bd = ((MendixDecimal) value).getValue(context);
				if ( bd != null )
					return bd.toString();
				return "";
			}
			else if ( value instanceof MendixHashString ) {
				TokenReplacer._logger.trace("Processing value as MendixHashString");
				return ((MendixHashString) value).getValue(context);
			}
			else if ( value instanceof MendixInteger ) {
				TokenReplacer._logger.trace("Processing value as MendixInteger");
				return Integer.toString(((MendixInteger) value).getValue(context));
			}
			else if ( value instanceof MendixString ) {
				TokenReplacer._logger.trace("Processing value as MendixString");
				return ((MendixString) value).getValue(context);
			}
			else if ( value instanceof MendixLong ) {
				TokenReplacer._logger.trace("Processing value as MendixLong");
				return Long.toString(((MendixLong) value).getValue(context));
			}
			else if ( value instanceof MendixAutoNumber ) {
				TokenReplacer._logger.trace("Processing value as MendixAutoNumber");
				return Long.toString(((MendixAutoNumber) value).getValue(context));
			}
			else
				TokenReplacer._logger.warn("Unimplemented attribute type: " + member.getName() + " <" + member.getClass().getName() + ">");

		}
		else
			TokenReplacer._logger.warn("Unimplemented value: " + value + " <" + value.getClass().getName() + ">");

		if ( value instanceof String ) {
			return ((String) value).trim();
		}

		return "";
	}

	public static String getTrimmedValue( IContext context, Object value ) {
		String strValue = null;
		if ( value != null ) {
			if ( value instanceof String )
				strValue = ((String) value).trim();
			else if ( value instanceof Float || value instanceof Double ) {
				if ( value instanceof Float )
					value = Double.valueOf((Float) value);
				strValue = getFormattedNumber(context, (Double) value, 2, 20);
			}
			else if ( value instanceof Date )
				strValue = processDate(context, (Date) value, true);
			else if ( value != null )
				strValue = String.valueOf(value);
		}

		return strValue;
	}

	private static String processDate( IContext context, Date value, boolean shouldLocalize ) {
		Date date = (Date) value;
		Locale userLocale = Core.getLocale(context);
		DateFormat dateFormat = new SimpleDateFormat("dd-MMM-yyyy", userLocale);

		TokenReplacer._logger.trace("Processing date in timezone " + (shouldLocalize ? getSessionTimeZone(context).getDisplayName() : "UTC"));
		if ( shouldLocalize )
			dateFormat.setTimeZone(getSessionTimeZone(context));
		else
			dateFormat.setTimeZone(getUTCTimeZone());

		return dateFormat.format(date);
	}

	public static TimeZone getSessionTimeZone( IContext context ) {
		ISession session = context.getSession();
		if ( session != null ) {
			TimeZone timeZone = session.getTimeZone();
			if ( timeZone != null )
				return timeZone;
			return getUTCTimeZone();
		}
		return getUTCTimeZone();
	}

	public static TimeZone getUTCTimeZone() {
		return TimeZone.getTimeZone("UTC");
	}

	private static String getFormattedNumber( IContext context, Double curValue, int minPrecision, int maxPrecision )
	{
		NumberFormat numberFormat = NumberFormat.getInstance(Core.getLocale(context));
		numberFormat.setMaximumFractionDigits(maxPrecision);
		numberFormat.setGroupingUsed(false);
		numberFormat.setMinimumFractionDigits(minPrecision);

		if ( !Double.isNaN(curValue) )
		{
			return numberFormat.format(curValue);
		}
		TokenReplacer._logger.trace("Processing number value " + curValue + ", it is not a number");

		return "";
	}
}
