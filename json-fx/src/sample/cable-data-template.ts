export const cablegDataTemplate = {
  "TemplateVersion": "'1.0'",
  "$all": "$",
  "$meter": "$all.Meter",
  "$hw": "$meter.HardwareVersions:notnull",
  "$asset": {
    "assetType": "DSP",
    "uniqueId": "$meter.SerialNumber:notnull",
    "manufacturer": "VIAVI",
    "model": "$meter.MeterType:notnull",
    "swVersion": "$meter.SoftwareVersions.AppVersion:notnull",
    "hwVersion": "'rf:' + $hw.RfVersion + '; modem:' + $hw.ModemType + $hw.ModemVersion + '; optical:' + $hw.OpticalVersion",
    "calibrationDate": "$hw.CalDate"
  },
  "Meter": "$meter",
  "Jobs": "$all.Jobs",
  "ChannelPlans": "$all.ChannelPlans",
  "LimitSets": "$all.LimitSets",
  "Autotests": "$all.Autotests",
  "//": "TODO: Ethernet test config assets",
  "CDM": {
    "asset": "$asset",
    "testData": {
      "$all.TestSets:map": {
        "$ts": "$",
        "$job": "$ts.JobId:ifelse($all.Jobs?:find($.Id == $ts.JobId))",
        "$workflow": "$job?.Workflow",
        "cdmVersion": "'2.0'",
        "workflow?": {
          "$workflow:ifelse": [
            "$workflow",
            {
              "$job:ifelse": {
                "workOrderId": "$job.Name",
                "date?": "$job.Attributes?.OpenTime?:substr(0, 10)?:add('T00:00Z')",
                "state?": ":ifelse($job.Attributes?.MeterStatus == 'Closed', 'COMPLETED', 'IN PROGRESS')",
                "techInfo": {
                  "techId": "$ts.TechID"
                }
              }
            }
          ]
        },
        "assetInfo": "$asset",
        "tests": [{
          "$tval": "$ts.TestValues",
          "type": ":ifelse($tval:length > 0, :ifelse($tval:length == 1, $tval:min($.Name), 'multi')):lowercase",
          "workflowId?": "$workflow?.workflowId",
          "configuration?": {
            "eType?": ":ifelse($ts.ChannelPlanId || $ts.LimitSetId || $ts.AutoTestId, 'dsp-native')",
            "channelPlan?": "$ts.ChannelPlanId:ifelse($all.ChannelPlans?:find($.Id == $ts.ChannelPlanId))",
            "limitSet?": "$ts.LimitSetId:ifelse($all.LimitSets?:find($.Id == $ts.LimitSetId))",
            "autoTest?": "$ts.AutoTestId:ifelse($all.AutoTests?:find($.Id == $ts.AutoTestId))",
            "//": "TODO: Ethernet test config assets"
          },
          "results": {
            "status": "$ts.Results:ifelse($ts.Results.Failed:ifelse('fail', 'pass'), 'none')",
            "testTime": "$ts.TestTime:notnull",
            "data": {
              "eType": "'dsp-native'",
              "testSet": "$ts",
              "job?": "$job"
            }
          },
          "testLocations?": {
            "$ts.TestLocation:ifelse": [[{
              "workflowId?": "$workflow?.workflowId",
              "label": "$ts.TestLocation"
            }]]
          }
        }]
      }
    }
  }
};
