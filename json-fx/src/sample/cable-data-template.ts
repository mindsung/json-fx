export const cablegDataTemplate = {
  "TemplateVersion": "`1.0`",

  "@asset($meter)": {
    "$hw": "$meter.HardwareVersions:notnull",

    "assetType": "DSP",
    "uniqueId": "$meter.SerialNumber:notnull",
    "manufacturer": "VIAVI",
    "model": "$meter.MeterType:notnull",
    "swVersion": "$meter.SoftwareVersions.AppVersion:notnull",
    "hwVersion": "`rf:` + $hw.RfVersion + `; modem:` + $hw.ModemType + $hw.ModemVersion + `; optical:` + $hw.OpticalVersion",
    "calibrationDate": "$hw.CalDate"
  },

  "Meter": "$.Meter",
  "Jobs": "$.Jobs",
  "ChannelPlans": "$.ChannelPlans",
  "LimitSets": "$.LimitSets",
  "AutoTests": "$.AutoTests",

  "//": "TODO: Ethernet test config assets",

  "@testset($ts)": {
    "$job": "ifelse($ts.JobId, $.Jobs?:find($ => $.Id == $ts.JobId), null)",

    "@workflow": {
      "workOrderId": "$job.Name",
      "date?": "$job.Attributes?.OpenTime?:substr(0, 10)?:add('T00:00Z')",
      "state?": "ifelse($job.Attributes?.MeterStatus == `Closed`, `COMPLETED`, `IN PROGRESS`)",
      "techInfo": {
        "techId": "$ts.TechID"
      }
    },

    "cdmVersion": "`2.0`",
    "workflow?": "$job?.Workflow || @workflow()",
  },

  "CDM": {
    "asset": "@asset($.Meter)",
    "testData": "$.TestSets:map(@testset)",
  }
};
