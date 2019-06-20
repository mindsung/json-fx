export const cableDataTemplate = {
  "TemplateVersion": "`1.0`",

  "Meter": "$.Meter",
  "Jobs": "$.Jobs",
  "ChannelPlans": "$.ChannelPlans",
  "LimitSets": "$.LimitSets",
  "AutoTests": "$.AutoTests",

  "//": "TODO: Ethernet test config assets",

  "@cdmAsset($meter)": {
    "$hw": "$meter.HardwareVersions:notnull",

    "assetType": "DSP",
    "uniqueId": "$meter.SerialNumber:notnull",
    "manufacturer": "VIAVI",
    "model": "$meter.MeterType:notnull",
    "swVersion": "$meter.SoftwareVersions.AppVersion:notnull",
    "hwVersion": "`rf:` + $hw.RfVersion + `; modem:` + $hw.ModemType + $hw.ModemVersion + `; optical:` + $hw.OpticalVersion",
    "calibrationDate": "$hw.CalDate"
  },

  "$asset": "@cdmAsset($.Meter)",

  "@cdmTestData($ts)": {
    "$job": "ifelse($ts.JobId, $.Jobs?:find($j => $j.Id == $ts.JobId), null)",

    "@workflow": {
      "workOrderId": "$job.Name",
      "date?": "$job.Attributes?.OpenTime?:substr(0, 10)?:add(`T00:00Z`)",
      "state?": "ifelse($job.Attributes?.MeterStatus == `Closed`, `COMPLETED`, `IN PROGRESS`)",
      "techInfo": {
        "techId?": "$ts.TechID || $ts.Attributes?.TechId"
      }
    },

    "cdmVersion": "`2.0`",
    "workflow?": "$job?.Workflow || @workflow()",
    "assetInfo": "$asset",
    "tests": [{
      "$tval": "$ts.TestValues",
      "type": "ifelse($tval:length() > 0, ifelse($tval:length() == 1, $tval:min($t => $t.Name), `multi`)):lowercase",
      "workflowId?": "$workflow?.workflowId",
      "configuration?": {
        "eType?": "ifelse($ts.ChannelPlanId || $ts.LimitSetId || $ts.AutoTestId, `dsp-native`)",
        "channelPlan?": "$ts.ChannelPlanId:ifelse($.ChannelPlans?:find($cp => $cp.Id == $ts.ChannelPlanId))",
        "limitSet?": "$ts.LimitSetId:ifelse($.LimitSets?:find($ls => $ls.Id == $ts.LimitSetId))",
        "autoTest?": "$ts.AutoTestId:ifelse($.AutoTests?:find($at => $at.Id == $ts.AutoTestId))",

        "//": "TODO: Ethernet test config assets"
      },
      "results": {
        "status": "$ts.Results:ifelse($ts.Results.Failed:ifelse(`fail`, `pass`), `none`)",
        "testTime": "$ts.TestTime:notnull",
        "data": {
          "eType": "`dsp-native`",
          "testSet": "$ts",
          "job?": "$job"
        }
      },

      "@cdmLocations()": [{
        "workflowId?": "$workflow?.workflowId",
        "label": "$ts.TestLocation"
      }],

      "testLocations?": "$ts.TestLocation:ifelse(@cdmLocations())"
    }]
  },

  "CDM": {
    "asset": "$asset",
    "testData": "$.TestSets:map(@cdmTestData)",
  }
};
