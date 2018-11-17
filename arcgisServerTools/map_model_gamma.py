import os
import arcpy, time
from arcpy.sa import *
arcpy.env.overwriteOutput = True

class LicenseError(Exception):
	pass

input_raster_directory = "//agis-fs/geo-data/agisdept/arcgisserver/CustomApp/LandSupply/"

# Try to check out the Spatial Analyst license; if this fails, raise a License Error exception.
arcpy.CheckOutExtension("Spatial")

#print "Starting"

# Set weights
output_raster = arcpy.GetParameterAsText(0)
input_area = arcpy.GetParameterAsText(1)
DIST_RDS_val = float(arcpy.GetParameterAsText(2))
DIST_SWT_val = float(arcpy.GetParameterAsText(3))
DIST_PRK_val = float(arcpy.GetParameterAsText(4))
DIST_WTL_val = float(arcpy.GetParameterAsText(5))
DIST_OSP_val = float(arcpy.GetParameterAsText(6))
DIST_RES_val = float(arcpy.GetParameterAsText(7))
DIST_COM_val = float(arcpy.GetParameterAsText(8))
DIST_IND_val = float(arcpy.GetParameterAsText(9))
DIST_AGR_val = float(arcpy.GetParameterAsText(10))
DIST_INS_val = float(arcpy.GetParameterAsText(11))
DIST_TRA_val = float(arcpy.GetParameterAsText(12))
AREA_RDS_val = float(arcpy.GetParameterAsText(13))
AREA_OSP_val = float(arcpy.GetParameterAsText(14))
AREA_RES_val = float(arcpy.GetParameterAsText(15))
AREA_COM_val = float(arcpy.GetParameterAsText(16))
AREA_IND_val = float(arcpy.GetParameterAsText(17))
AREA_AGR_val = float(arcpy.GetParameterAsText(18))
AREA_INS_val = float(arcpy.GetParameterAsText(19))
AREA_FUT_val = float(arcpy.GetParameterAsText(20))
AREA_HNT_val = float(arcpy.GetParameterAsText(21))
MINRT_QZ_val = float(arcpy.GetParameterAsText(22))
MINRT_PL_val = float(arcpy.GetParameterAsText(23))
LANDS_VC_val = float(arcpy.GetParameterAsText(24))
LANDS_NG_val = float(arcpy.GetParameterAsText(25))
LANDS_FN_val = float(arcpy.GetParameterAsText(26))
SLOPE_10_val = float(arcpy.GetParameterAsText(27))
SLOPE_25_val = float(arcpy.GetParameterAsText(28))

#print "Loading rasters"

DIST_RDS = Raster(input_raster_directory + input_area + ".gdb/DIST_RDS")
DIST_SWT = Raster(input_raster_directory + input_area + ".gdb/DIST_SWT")
DIST_PRK = Raster(input_raster_directory + input_area + ".gdb/DIST_PRK")
DIST_WTL = Raster(input_raster_directory + input_area + ".gdb/DIST_WTL")
DIST_OSP = Raster(input_raster_directory + input_area + ".gdb/DIST_OSP")
DIST_RES = Raster(input_raster_directory + input_area + ".gdb/DIST_RES")
DIST_COM = Raster(input_raster_directory + input_area + ".gdb/DIST_COM")
DIST_IND = Raster(input_raster_directory + input_area + ".gdb/DIST_IND")
DIST_AGR = Raster(input_raster_directory + input_area + ".gdb/DIST_AGR")
DIST_INS = Raster(input_raster_directory + input_area + ".gdb/DIST_INS")
DIST_TRA = Raster(input_raster_directory + input_area + ".gdb/DIST_TRA")
AREA_RDS = Raster(input_raster_directory + input_area + ".gdb/AREA_RDS")
AREA_OSP = Raster(input_raster_directory + input_area + ".gdb/AREA_OSP")
AREA_RES = Raster(input_raster_directory + input_area + ".gdb/AREA_RES")
AREA_COM = Raster(input_raster_directory + input_area + ".gdb/AREA_COM")
AREA_IND = Raster(input_raster_directory + input_area + ".gdb/AREA_IND")
AREA_AGR = Raster(input_raster_directory + input_area + ".gdb/AREA_AGR")
AREA_INS = Raster(input_raster_directory + input_area + ".gdb/AREA_INS")
AREA_FUT = Raster(input_raster_directory + input_area + ".gdb/AREA_FUT")
AREA_HNT = Raster(input_raster_directory + input_area + ".gdb/AREA_HNT")
MINRT_QZ = Raster(input_raster_directory + input_area + ".gdb/MINRT_QZ")
MINRT_PL = Raster(input_raster_directory + input_area + ".gdb/MINRT_PL")
LANDS_VC = Raster(input_raster_directory + input_area + ".gdb/LANDS_VC")
LANDS_NG = Raster(input_raster_directory + input_area + ".gdb/LANDS_NG")
LANDS_FN = Raster(input_raster_directory + input_area + ".gdb/LANDS_FN")
SLOPE_10 = Raster(input_raster_directory + input_area + ".gdb/SLOPE_10")
SLOPE_25 = Raster(input_raster_directory + input_area + ".gdb/SLOPE_25")
SLOPE_50 = Raster(input_raster_directory + input_area + ".gdb/SLOPE_50")

# Score the remaining areas
#print "Doing math"
#Score_1 = (DIST_RDS * DIST_RDS_val) + (DIST_SWT * DIST_SWT_val) \
#	+ (DIST_PRK * DIST_PRK_val) + (DIST_WTL * DIST_WTL_val) \
#	+ (DIST_OSP * DIST_OSP_val) + (DIST_RES * DIST_RES_val) \
#	+ (DIST_COM * DIST_COM_val) + (DIST_IND * DIST_IND_val) \
#	+ (DIST_AGR * DIST_AGR_val) + (DIST_INS * DIST_INS_val) \
#	+ (DIST_TRA * DIST_TRA_val) + (AREA_OSP * AREA_OSP_val) \
#	+ (AREA_RES * AREA_RES_val) + (AREA_COM * AREA_COM_val) \
#	+ (AREA_IND * AREA_IND_val) + (AREA_AGR * AREA_AGR_val) \
#	+ (AREA_FUT * AREA_FUT_val) + (AREA_INS * AREA_INS_val) \
#	+ (AREA_HNT * AREA_HNT_val) + (MINRT_QZ * MINRT_QZ_val) \
#	+ (MINRT_PL * MINRT_PL_val) + (LANDS_VC * LANDS_VC_val) \
#	+ (LANDS_NG * LANDS_NG_val) + (LANDS_FN * LANDS_FN_val) \
#	+ (SLOPE_10 * SLOPE_10_val) + (SLOPE_25 * SLOPE_25_val) \
#	+ (AREA_RDS * AREA_RDS_val)


##Long form math

Score_1 = Times(DIST_RDS,DIST_RDS_val)
Score_1 = Plus(Score_1,Times(DIST_SWT,DIST_SWT_val))
Score_1 = Plus(Score_1,Times(DIST_PRK,DIST_PRK_val))
Score_1 = Plus(Score_1,Times(DIST_WTL,DIST_WTL_val))
Score_1 = Plus(Score_1,Times(DIST_OSP,DIST_OSP_val))
Score_1 = Plus(Score_1,Times(DIST_RES,DIST_RES_val))
Score_1 = Plus(Score_1,Times(DIST_COM,DIST_COM_val))
Score_1 = Plus(Score_1,Times(DIST_IND,DIST_IND_val))
Score_1 = Plus(Score_1,Times(DIST_AGR,DIST_AGR_val))
Score_1 = Plus(Score_1,Times(DIST_INS,DIST_INS_val))
Score_1 = Plus(Score_1,Times(DIST_TRA,DIST_TRA_val))
Score_1 = Plus(Score_1,Times(AREA_RDS,AREA_RDS_val))
Score_1 = Plus(Score_1,Times(AREA_OSP,AREA_OSP_val))
Score_1 = Plus(Score_1,Times(AREA_RES,AREA_RES_val))
Score_1 = Plus(Score_1,Times(AREA_COM,AREA_COM_val))
Score_1 = Plus(Score_1,Times(AREA_IND,AREA_IND_val))
Score_1 = Plus(Score_1,Times(AREA_AGR,AREA_AGR_val))
Score_1 = Plus(Score_1,Times(AREA_INS,AREA_INS_val))
Score_1 = Plus(Score_1,Times(AREA_FUT,AREA_FUT_val))
Score_1 = Plus(Score_1,Times(AREA_HNT,AREA_HNT_val))
Score_1 = Plus(Score_1,Times(MINRT_QZ,MINRT_QZ_val))
Score_1 = Plus(Score_1,Times(MINRT_PL,MINRT_PL_val))
Score_1 = Plus(Score_1,Times(LANDS_VC,LANDS_VC_val))
Score_1 = Plus(Score_1,Times(LANDS_NG,LANDS_NG_val))
Score_1 = Plus(Score_1,Times(LANDS_FN,LANDS_FN_val))
Score_1 = Plus(Score_1,Times(SLOPE_10,SLOPE_10_val))
Score_1 = Plus(Score_1,Times(SLOPE_25,SLOPE_25_val))





# Create filtering to completely eliminate some areas
#print "Filtering"
filter_1 = Con(AREA_RDS == 1, 1)
filter_2 = Con(SLOPE_50 == 0, 1)
initial_extent = filter_1 * filter_2

# Manually downgrade open space areas / wetland areas to minimum value
Score_2 = Con(AREA_OSP > 0, -10.0, Score_1)

# Save final score
#print "Saving"
Score_final = initial_extent * Score_2
Score_final.save(output_raster)
#Score_1.save(output_raster)
#DIST_RDS.save(output_raster)
arcpy.CalculateStatistics_management(output_raster)

# Check in Spatial Analyst license
arcpy.CheckInExtension("Spatial")
