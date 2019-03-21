export const $DSPTEMPL = {
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
  "$all.TestSets:map": {
    "$ts": "$",
    "$job": ":ifelse($ts.JobId, $all.Jobs?:find($.id == $ts.JobId))",
    "$workflow": "$job?.Attributes?.Workflow",
    "cdmVersion": "'2.0'",
    "workflow?": {
      "$workflow:ifelse": [
        "$workflow",
        {
          "$job:ifelse": {
            "workOrderId": "$job.Name",
            "techInfo": {
              "techId": "$job.TechId || $job.techId"
            }
          }
        }
      ]
    },
    "assetInfo": "$asset",
    "tests": [
      {
        "configuration?": {
          "channelPlan?": ":ifelse($ts.ChannelPlanId, $all.ChannelPlans?:find($.Id == $ts.ChannelPlanId))",
          "limitSet?": ":ifelse($ts.LimitSetId, $all.LimitSets?:find($.Id == $ts.LimitSetId))",
          "autoTest?": ":ifelse($ts.AutoTestId, $all.AutoTests?:find($.id == $ts.AutoTestId))",
          "//": "TODO: Ethernet test config assets"
        },
        "results": {
          "status": ":ifelse($ts.Results, :ifelse($ts.Results.Failed, 'fail', 'pass'), 'none')",
          "testTime": "$ts.TestTime:notnull",
          "data": {
            "testSet": "$ts",
            "job?": "$job"
          }
        }
      }
    ]
  }
};

export const $DSP = {
  "Meter":
    {
      "SerialNumber": "1000EADS",
      "Time": "2019-03-18T19:02:53.165Z",
      "Settings": {
        "AutoUpdate": false,
        "CableModemCalVersion": 1,
        "CableModemCorrection": 2.5,
        "CableModemUpstreamCorrection": 2.5,
        "CurrentUser": 0,
        "DebugLevel": 0,
        "DefaultInterface": "Ethernet",
        "DirectToTethered": false,
        "Locked": false,
        "MeasurementUnits": "dBmV",
        "MeterLanguage": "en_US",
        "ModemDMac": "F0:F2:49:21:54:98",
        "ModemDebugModuleConfig": "",
        "ModemDiplexer": 85,
        "ModemSerialNumber": "253161000241",
        "ModemVMac": "F0:F2:49:21:54:99",
        "ModemVersion": "V15.8.17.1",
        "MultiUserMode": true,
        "Timezone": "EST+5EDT",
        "WifiType": "RS9110"
      },
      "IPAddress": "10.11.20.177",
      "SoftwareVersions": {
        "WebserverVersion": "V18.06.29.150",
        "AppVersion": "V18.06.29.149",
        "KernelVersion": "2.6.36-V15.08.03.01",
        "PackageVersion": "V18.06.29.151",
        "RfsVersion": "V18.03.22.1"
      },
      "CpeMacAddress": "00:02:7C:01:D2:50",
      "CurrentUser": 0,
      "DnsName": "tri-01d250",
      "HardwareVersions": {
        "CalDate": "2016-08-08T22:34:01Z",
        "CalSerial": 203494,
        "GigeMac": "00:02:7c:00:00:00",
        "ModemDMac": "F0:F2:49:21:54:98",
        "ModemSerialNumber": "253161000241",
        "ModemType": "US3A",
        "ModemVMac": "F0:F2:49:21:54:99",
        "ModemVersion": "V15.8.17.1",
        "OpticalCalDate": "1970-01-01T00:00:00Z",
        "OpticalCalSerial": 0,
        "OpticalVersion": "V0",
        "RfVersion": "V3-6MHz",
        "WifiMac": "00:02:7c:00:00:00",
        "WifiType": "RS9110"
      },
      "MeterType": "1GDSP",
      "OptionIds": [
        258,
        23
      ],
      "Options": {
        "DualRf": true,
        "Meter1GDSP": true
      },
      "CurrentUserInfo": {
        "BluetoothSettings": {
          "BtMode": "BtServer",
          "IpAddress": "172.23.60.1",
          "IpMode": "Ipv4Static",
          "IpSubnet": "255.255.255.0",
          "PromptUser": true
        },
        "BrowserSettings": {
          "BrowserHomePage": "/tmp/index.html",
          "BrowserHrefLabel": [
            "Google",
            "Yahoo",
            "Google",
            "Web Test",
            "Yahoo",
            "Google"
          ],
          "BrowserHrefLink": [
            "http://www.google.com",
            "http://www.yahoo.com",
            "http://www.google.com/",
            "http://apps.trilithic.com/connect/360",
            "http://m.yahoo.com/",
            "http://www.google.com/"
          ],
          "ViewpointLink": "http://viewpoint.trilithic.com/Connect/MeterKey"
        },
        "CableModemSettings": {
          "AnnexMode": 0,
          "BypassIp": false,
          "DM31ConnCount": 5,
          "DocsisMode": 0,
          "MacCertificate": 0,
          "PrimaryFrequency": 0,
          "PromptUser": true,
          "UpstreamId": 0,
          "UseRFoGModem": 0
        },
        "ChannelPresetSettings": {
          "ChannelPreset": [
            {
              "Bandwidth": 6000000,
              "CenterFrequency": 0,
              "ChannelNumber": 0,
              "Configuration": {
                "AudioFrequency": 9,
                "SAPFrequency": 4879274,
                "Scrambled": true,
                "Standard": "NTSC",
                "VideoFrequency": 4877064
              },
              "Id": "",
              "IsFavorite": false,
              "Name": "NTSC",
              "Type": "Analog"
            },
            {
              "Bandwidth": 8000000,
              "CenterFrequency": 0,
              "ChannelNumber": 0,
              "Configuration": {
                "AudioFrequency": 24,
                "SAPFrequency": 4879584,
                "Scrambled": true,
                "Standard": "PALG",
                "VideoFrequency": 96
              },
              "Id": "",
              "IsFavorite": false,
              "Name": "PAL G",
              "Type": "Analog"
            },
            {
              "Bandwidth": 6000000,
              "CenterFrequency": 0,
              "ChannelNumber": 0,
              "Configuration": {
                "Docsis": true,
                "Modulation": "256QAM",
                "Standard": "AnnexB",
                "SymbolRate": 5360537
              },
              "Id": "",
              "IsFavorite": false,
              "Name": "Dig Video",
              "Type": "Digital"
            },
            {
              "Bandwidth": 6000000,
              "CenterFrequency": 0,
              "ChannelNumber": 0,
              "Configuration": {
                "Docsis": true,
                "Modulation": "256QAM",
                "Standard": "AnnexB",
                "SymbolRate": 5360537
              },
              "Id": "",
              "IsFavorite": false,
              "Name": "DOCSIS",
              "Type": "Digital"
            }
          ],
          "CurrentChannelPlan": "default"
        },
        "CompanyName": "VIAVI",
        "ConfigModTime": "2018-06-11T13:12:46.777Z",
        "CurrentChannelPlan": "ncta",
        "CurrentChannelPlanSubType": "package",
        "CurrentJob": "None",
        "CurrentLimitSet": "CPE-2",
        "CurrentLimitSetSubType": "package",
        "CurrentTestPoint": "tpre",
        "EthernetSettings": {
          "GigeIpAddress": "",
          "GigeIpGateway": "",
          "GigeIpMode": "Ipv4Dhcp",
          "GigeIpPriDns": "",
          "GigeIpSecDns": "",
          "GigeIpSubnet": "",
          "IpAddress": "",
          "IpGateway": "",
          "IpMode": "Ipv4Dhcp",
          "IpPriDns": "",
          "IpSecDns": "",
          "IpSubnet": "",
          "PromptUser": true
        },
        "HexpadHistory": null,
        "KeyboardHistory": [
          "246135-screen-1",
          "246135-Scan-0",
          "246135",
          "123456-screen-5",
          "123456-Scan-4",
          "654321-Spectrum-1",
          "123456-screen-3",
          "123456-Scan-2",
          "123456-screen-1",
          "123456-Level-0",
          "654321",
          "123456",
          "Rsa-1",
          "RsaRef",
          "Rsa",
          "Scan",
          "http://stratasync.viavisolutions.com",
          "16653523",
          "70529",
          "VIAVI",
          "eads-us",
          "re1234",
          "https://test.stratasync.viavisolutions.com",
          "1234567890",
          "viavssl",
          "99532020",
          "https://dev.stratasync.viavisolutions.com",
          "http://10.11.36.102:8080",
          "https://10.11.36.102:8443",
          "333333",
          "tpre",
          "iptv2",
          "abc",
          "gt",
          "testpoint",
          "ty",
          "222222",
          "eads1",
          "111111",
          "876542",
          "876543",
          "Spectrum-3",
          "Spectrum-2",
          "Spectrum-1",
          "Spectrum",
          "screen",
          "limitname",
          "myplan",
          "Scan-1",
          "Level"
        ],
        "KeypadHistory": [
          "100"
        ],
        "LoopbackZero": 0,
        "MeasureConstants": {
          "AnalogNoiseBW": 4000000,
          "ChannelEncoding": "ntsc",
          "ChannelSkipAnalog": false,
          "HumType": "60Hz",
          "OptimalModulation": 87.5,
          "VelocityOfPropagation": 82,
          "VopPresets": [
            {
              "Name": "RG-59 Mini VoP",
              "Vop": 83
            },
            {
              "Name": "RG-59 VoP",
              "Vop": 85
            },
            {
              "Name": "RG-6 VoP",
              "Vop": 85
            },
            {
              "Name": "RG-11 VoP",
              "Vop": 85
            },
            {
              "Name": "Semi-Rigid VoP",
              "Vop": 87
            },
            {
              "Name": "Hardline VoP",
              "Vop": 87
            }
          ]
        },
        "Menus": {
          "CabDiag": {
            "Velocity": 795
          },
          "ChannelUsage": {
            "Band": 0,
            "ColorMapIdx": 3,
            "Display": 0,
            "FullScalePercent": 50,
            "Marker": 0,
            "Mode": 0
          },
          "CmStat": {
            "ShowCodewordError": false,
            "UseLimitSet": false
          },
          "CmSweep": {
            "ChannelIndexA": 0,
            "ChannelIndexB": 999,
            "DbDiv": 10,
            "RefName": "",
            "Reference": 10,
            "ShowingSpace": true,
            "StartFreq": 0,
            "StartFreqIndex": 0,
            "StopFreq": 0,
            "StopFreqIndex": 127
          },
          "DeviceFinder": {
            "AutoStart": false,
            "Mac": "",
            "Type": 0
          },
          "Docsis31Info": {
            "merMode": 2,
            "sortSCByMER": false
          },
          "Evs": {
            "ChannelIndex": 0,
            "DbDiv": 10,
            "Detector": 3,
            "MarkerA": 0,
            "MarkerB": 0,
            "Reference": 0,
            "UseLimitSet": false
          },
          "Fdr": {
            "Events": 4,
            "MarkerA": 0,
            "Reference": 0,
            "StartDistance": 0,
            "StopDistance": 0,
            "UnitScale": 1,
            "ZoomLevel": 0
          },
          "FiberScope": {
            "Magnification": false,
            "ProfileIdx": 0,
            "ShowSpec": true,
            "UseLimitSet": false
          },
          "ForwardSpectrum": {
            "Attenuation": 0,
            "DbDiv": 10,
            "Detector": 4,
            "Dwell": 4,
            "MarkerA": 100000000,
            "MarkerB": 800000000,
            "Rbw": 0,
            "Reference": 0,
            "ShowPeakMarkerValue": false,
            "StartFreq": 100000000,
            "StartStopMode": 0,
            "StopFreq": 800000000,
            "UseLimitSet": false
          },
          "Gige": {
            "GigeFavorites": null,
            "GigeTestType": 1,
            "IpAddress": "",
            "TxRate": 10
          },
          "Leakage": {
            "Speaker": true,
            "SquelchHigh": 0,
            "SquelchLow": 0
          },
          "Level": {
            "BerTimeDiv": 1,
            "ChBerDiv": 0,
            "ChannelIndex": 0,
            "ChannelNumber": 0,
            "DbDiv": 10,
            "EqTapIndex": 7,
            "Frequency": 50000000,
            "FromScan": false,
            "FromTilt": false,
            "Reference": 10,
            "UseChannelPlan": true,
            "UseLimitSet": true
          },
          "Minnow": {
            "Reference": 0,
            "UsingRef": false,
            "Wavelength": 1310
          },
          "Nav": {
            "NavIcon": 0,
            "NavIconLayout": [
              {
                "IconList": [
                  "Jobs",
                  "ViewPoint",
                  "AutoTests"
                ],
                "TabName": "Autotest"
              },
              {
                "IconList": [
                  "Level",
                  "Scan",
                  "Tilt",
                  "Spectrum",
                  "CmStat",
                  "UpEq",
                  "Sweep",
                  "Rsa",
                  "SstCompare",
                  "NetTests",
                  "Gige",
                  "Fdr",
                  "QamEvs",
                  "Traffic",
                  "CmSweep"
                ],
                "TabName": "Troubleshoot"
              },
              {
                "IconList": [
                  "Info",
                  "Setup",
                  "Files",
                  "CalTouch",
                  "Firmware"
                ],
                "TabName": "Setup"
              },
              {
                "IconList": [
                  "Browser",
                  "Wifi",
                  "Notepad",
                  "Source",
                  "Opm",
                  "Vfl"
                ],
                "TabName": "Utility"
              }
            ],
            "NavTab": 0
          },
          "NetTests": {
            "ActsPort": 28657,
            "DesiredDownstreamRate": 100,
            "DesiredUpstreamRate": 30,
            "FileSizeKnown": false,
            "IpAddress": "",
            "LastFileSize": 500,
            "NetFavorites": [
              {
                "ActsPort": 28657,
                "Address": "http://69.241.70.138/speedtest/3g.bin",
                "Label": "CC office",
                "PingPacketAmount": 50,
                "TestType": "speedTest",
                "UserGenerated": false
              },
              {
                "ActsPort": 28657,
                "Address": "http://trilithicspeedtest.com/50mb.zip",
                "Label": "Trilithic Speedtest",
                "PingPacketAmount": 50,
                "TestType": "pingTest",
                "UserGenerated": false
              },
              {
                "ActsPort": 28657,
                "Address": "http://trilithicspeedtest.com/50mb.zip",
                "Label": "Trilithic Speedtest",
                "PingPacketAmount": 50,
                "TestType": "speedTest",
                "UserGenerated": false
              },
              {
                "ActsPort": 28657,
                "Address": "http://192.168.60.2/test.zip",
                "Label": "Zip test office",
                "PingPacketAmount": 50,
                "TestType": "pingTest",
                "UserGenerated": false
              },
              {
                "ActsPort": 28657,
                "Address": "http://192.168.60.2/test.zip",
                "Label": "Zip test office",
                "PingPacketAmount": 50,
                "TestType": "speedTest",
                "UserGenerated": false
              },
              {
                "ActsPort": 28657,
                "Address": "http://192.168.60.2/5agb.bin",
                "Label": "5G test office",
                "PingPacketAmount": 50,
                "TestType": "pingTest",
                "UserGenerated": false
              },
              {
                "ActsPort": 28657,
                "Address": "http://192.168.60.2/5agb.bin",
                "Label": "5G test office",
                "PingPacketAmount": 50,
                "TestType": "speedTest",
                "UserGenerated": false
              },
              {
                "ActsPort": 28657,
                "Address": "http://207.250.51.174",
                "Label": "ACTS",
                "PingPacketAmount": 50,
                "TestType": "pingTest",
                "UserGenerated": false
              },
              {
                "ActsPort": 28657,
                "Address": "http://207.250.51.174",
                "Label": "ACTS",
                "PingPacketAmount": 50,
                "TestType": "ACTS",
                "UserGenerated": false
              },
              {
                "ActsPort": 28657,
                "Address": "10.2.80.73",
                "Label": "tom",
                "PingPacketAmount": 50,
                "TestType": "pingTest",
                "UserGenerated": false
              }
            ],
            "NetTestType": 3,
            "PingPacketAmount": 50,
            "Url": "http://trilithicspeedtest.com/50mb.zip",
            "UseLimitSet": true
          },
          "OfdmEvs": {
            "DbDiv": 10,
            "MarkerA": 0,
            "MarkerB": 0,
            "Reference": 0
          },
          "Onu": {
            "Reference": 0,
            "UsingRef": false,
            "Wavelength": 1310
          },
          "Opm": {
            "Reference": 0,
            "UsingRef": false,
            "Wavelength": 1310
          },
          "ReturnSpectrum": {
            "Attenuation": 0,
            "DbDiv": 10,
            "MarkerA": 10000000,
            "MarkerB": 8000000,
            "Reference": 0,
            "ShowPeakMarkerValue": false,
            "StartFreq": 4000000,
            "StopFreq": 85000000,
            "UseLimitSet": false
          },
          "ReturnSweep": {
            "Mode": 0,
            "TPInjFlag": false,
            "TPInjectLevel": 40
          },
          "Rfc": {
            "BtbActiveSave": 1,
            "BtbDeltaTxTime": 10,
            "BtbFinalTxTime": 50,
            "BtbInitTxTime": 2,
            "BtbTxRate": 100,
            "FlActiveSave": 1,
            "FlDeltaTxRate": 2,
            "FlInitTxRate": 100,
            "FlTotalTxTime": 5,
            "FrameLength1": 128,
            "FrameLength2": 256,
            "FrameLength3": 512,
            "FrameLength4": 1024,
            "FrameLength5": 1280,
            "FrameLength6": 1518,
            "LatActiveSave": 1,
            "LpdvRepeats": 1,
            "LpdvTotalTxTime": 5,
            "LpdvTxRate": 100,
            "ThresholdBtb": 2,
            "ThresholdFl": 2,
            "ThresholdTp": 2,
            "TpActiveSave": 1,
            "TpDeltaTxRate": 1,
            "TpInitTxRate": 100,
            "TpTotalTxTime": 5
          },
          "Rsa": {
            "Amplitude": 40,
            "ChannelIndexA": 0,
            "ChannelIndexB": 289,
            "DbDiv": 10,
            "LinkFreqFavorites": [
              {
                "Label": "",
                "Number": 101000000
              }
            ],
            "LinkFrequency": 100000000,
            "RefName": "RsaRef",
            "Reference": 58,
            "StartFreq": 3531250,
            "StopFreq": 84906248,
            "TxPort": 0,
            "UnitId": 0
          },
          "Scan": {
            "ChannelIndexA": 0,
            "ChannelIndexB": 3,
            "ChannelNumber": 0,
            "DbDiv": 10,
            "FromLevel": false,
            "Reference": 10,
            "ScanMode": 0,
            "UseChannelPlan": false,
            "UseLimitSet": true
          },
          "SetupNetFavorites": {
            "testType": 3
          },
          "SingleChannelUsage": {
            "Channel": 0
          },
          "Source": {
            "Amplitude": 40,
            "Bandwidth": 24000000,
            "BitErrorRate": 0,
            "ContPilotParam": 48,
            "CyclicPrefix": 5,
            "FFTSize": 0,
            "Frequency": 50000000,
            "Loopback": false,
            "ModOrder": 6,
            "Modulation": 0,
            "OfdmAmplitude": 30,
            "OfdmBitErrorRate": 0,
            "OfdmCentFreq": 40000000,
            "PLCFreq": 38000000,
            "Rolloff": 1,
            "SymbolRate": 5120000,
            "TestMode": 0
          },
          "Spectrum": {
            "AutoAttnMode": true,
            "Mode": 0
          },
          "Ssr": {
            "Amplitude": 40,
            "Carrier": [
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true
            ],
            "ChannelIndexA": 0,
            "ChannelIndexB": 7,
            "DbDivHeadend": 10,
            "DbDivLocal": 10,
            "IngressMarker": 30000000,
            "LinkFreqFavorites": [
              {
                "Label": "office",
                "NumberFreq": 100000000,
                "NumberSpeed": 0
              }
            ],
            "LinkFrequency": 700000000,
            "LinkSpeed": 0,
            "NodeId": 0,
            "RefName": "",
            "ReferenceHeadend": 10,
            "ReferenceLocal": 10,
            "StartFreq": 0,
            "StopFreq": 85000000,
            "TxPort": 0,
            "UnitId": 0
          },
          "Sweep": {
            "AutoAdjust": true,
            "DbDiv": 10,
            "MarkerA": 0,
            "MarkerB": 1000000000,
            "RefName": "",
            "Reference": 10,
            "UseFSTChannels": true
          },
          "Tdr": {
            "CompSense": 1,
            "DisplayCableLimits": true,
            "LowerImpLimit": 0,
            "LowerSlopeLimit": -7000,
            "Marker2Idx": 0,
            "MarkerIdx": 0,
            "NumDataPoints": 256,
            "NumReads": 1,
            "StartDistance": 0,
            "StopDistance": 0,
            "TraceChoice": 1,
            "UnitScale": 1,
            "UpperImpLimit": 2000,
            "UpperSlopeLimit": 7000
          },
          "TestPointPreset": {
            "Name": ""
          },
          "Tilt": {
            "ChannelIndexA": 0,
            "ChannelIndexB": 999,
            "ChannelNumber": 0,
            "DbDiv": 10,
            "FromLevel": false,
            "Reference": 10,
            "ScanMode": 1,
            "UseChannelPlan": false,
            "UseLimitSet": false
          },
          "Traffic": {
            "Attenuation": -1,
            "Background": 0,
            "Colors": "Blue Yellow Red",
            "DbPerDiv": 2,
            "DbPerLevel": 1,
            "HoldCount": 8,
            "LPF": 0,
            "MarkerA": 4000000,
            "MarkerB": 85000000,
            "Normalization": 1000,
            "Reference": 0,
            "RoiCenter": 16900000,
            "RoiMode": 0,
            "RoiSpan": 6400000,
            "ShowPersistence": true,
            "StartFreq": 4000000,
            "StopFreq": 85000000,
            "Threshold": -45
          },
          "UpEq": {
            "EqDbDiv": 10,
            "EqRef": 0,
            "GroupDelayNanoSecDiv": 100,
            "GroupDelayRef": 4,
            "InChannelDbDiv": 5,
            "InChannelRef": 4,
            "MarkerDistance": 1000000,
            "MarkerLock": true
          },
          "Vfl": {
            "PulseMode": 0
          },
          "VopConfig": {
            "Hardline": 870,
            "RG11": 850,
            "RG59": 850,
            "RG59Mini": 830,
            "RG6": 850,
            "Semirigid": 870
          },
          "WifiClients": {
            "Ssid": "__ALL__"
          },
          "WifiD": {
            "WifiDAddr": "",
            "WifiDChannel": "",
            "WifiDEncrypt": "",
            "WifiDFreq": "",
            "WifiDLevel": "",
            "WifiDSsid": ""
          },
          "WifiSurvey": {
            "Band": 0,
            "DisplaySsids": true,
            "DisplayZigbee": false,
            "Mode": 0,
            "Sort": 1
          },
          "Y1564": {
            "AVAIL": 99,
            "CirRun": 1,
            "EirRun": 1,
            "FDV": 5,
            "FTD": 5,
            "FlrDen": 1000,
            "FlrNum": 1,
            "PerfDuration": 15,
            "PolRun": 1,
            "StreamConfig": [
              {
                "CirPercent": 20,
                "CirSteps": 2,
                "ColorMode": 0,
                "DestinationPort": 80,
                "EirPercent": 20,
                "Enable": false,
                "FrameSize": 512,
                "FrameType": 1,
                "GreenCode": 0,
                "Pol": 25,
                "PriorityType": 0,
                "SourcePort": 890,
                "StartingIR": 15,
                "StepTime": 5,
                "UseVLan": 0,
                "VLanID": 0,
                "YellowCode": 0
              },
              {
                "CirPercent": 20,
                "CirSteps": 2,
                "ColorMode": 0,
                "DestinationPort": 80,
                "EirPercent": 20,
                "Enable": false,
                "FrameSize": 512,
                "FrameType": 1,
                "GreenCode": 0,
                "Pol": 25,
                "PriorityType": 0,
                "SourcePort": 890,
                "StartingIR": 15,
                "StepTime": 5,
                "UseVLan": 0,
                "VLanID": 0,
                "YellowCode": 0
              },
              {
                "CirPercent": 20,
                "CirSteps": 2,
                "ColorMode": 0,
                "DestinationPort": 80,
                "EirPercent": 20,
                "Enable": false,
                "FrameSize": 512,
                "FrameType": 1,
                "GreenCode": 0,
                "Pol": 25,
                "PriorityType": 0,
                "SourcePort": 890,
                "StartingIR": 15,
                "StepTime": 5,
                "UseVLan": 0,
                "VLanID": 0,
                "YellowCode": 0
              },
              {
                "CirPercent": 20,
                "CirSteps": 2,
                "ColorMode": 0,
                "DestinationPort": 80,
                "EirPercent": 20,
                "Enable": false,
                "FrameSize": 512,
                "FrameType": 1,
                "GreenCode": 0,
                "Pol": 25,
                "PriorityType": 0,
                "SourcePort": 890,
                "StartingIR": 15,
                "StepTime": 5,
                "UseVLan": 0,
                "VLanID": 0,
                "YellowCode": 0
              },
              {
                "CirPercent": 20,
                "CirSteps": 2,
                "ColorMode": 0,
                "DestinationPort": 80,
                "EirPercent": 20,
                "Enable": false,
                "FrameSize": 512,
                "FrameType": 1,
                "GreenCode": 0,
                "Pol": 25,
                "PriorityType": 0,
                "SourcePort": 890,
                "StartingIR": 15,
                "StepTime": 5,
                "UseVLan": 0,
                "VLanID": 0,
                "YellowCode": 0
              },
              {
                "CirPercent": 20,
                "CirSteps": 2,
                "ColorMode": 0,
                "DestinationPort": 80,
                "EirPercent": 20,
                "Enable": false,
                "FrameSize": 512,
                "FrameType": 1,
                "GreenCode": 0,
                "Pol": 25,
                "PriorityType": 0,
                "SourcePort": 890,
                "StartingIR": 15,
                "StepTime": 5,
                "UseVLan": 0,
                "VLanID": 0,
                "YellowCode": 0
              },
              {
                "CirPercent": 20,
                "CirSteps": 2,
                "ColorMode": 0,
                "DestinationPort": 80,
                "EirPercent": 20,
                "Enable": false,
                "FrameSize": 512,
                "FrameType": 1,
                "GreenCode": 0,
                "Pol": 25,
                "PriorityType": 0,
                "SourcePort": 890,
                "StartingIR": 15,
                "StepTime": 5,
                "UseVLan": 0,
                "VLanID": 0,
                "YellowCode": 0
              },
              {
                "CirPercent": 20,
                "CirSteps": 2,
                "ColorMode": 0,
                "DestinationPort": 80,
                "EirPercent": 20,
                "Enable": false,
                "FrameSize": 512,
                "FrameType": 1,
                "GreenCode": 0,
                "Pol": 25,
                "PriorityType": 0,
                "SourcePort": 890,
                "StartingIR": 15,
                "StepTime": 5,
                "UseVLan": 0,
                "VLanID": 0,
                "YellowCode": 0
              }
            ]
          }
        },
        "OpmLevel": 0,
        "PeriodicNextTestTime": 0,
        "PeriodicTestCount": 0,
        "PeriodicTestPlanName": "",
        "SetupSecurity": {
          "DeleteFilesLocked": false,
          "SetupBluetoothLocked": false,
          "SetupCableModemLocked": false,
          "SetupChPlanLocked": false,
          "SetupEthernetLocked": false,
          "SetupGigeLocked": false,
          "SetupGlobalLocked": false,
          "SetupInterfaceLocked": false,
          "SetupLimSetLocked": false,
          "SetupMeasureLocked": false,
          "SetupNetTestFavoritesLocked": false,
          "SetupUserLocked": false,
          "SetupWiFiLocked": false,
          "TestPointCompLocked": false,
          "UpdateFirmwareLocked": false
        },
        "SoftwareVersions": {
          "AppVersion": "V18.06.29.149",
          "KernelVersion": "2.6.36-V15.08.03.01",
          "PackageVersion": "V18.06.29.151",
          "RfsVersion": "V18.03.22.1"
        },
        "StrataSyncAccountID": "16653523",
        "StrataSyncURL": "http://stratasync.viavisolutions.com",
        "TechID": "70529",
        "TestPointComp": 0,
        "TestPointLabel": "",
        "TestProbeComp": 0,
        "UsbFirmwarePath": "/media/sda1/",
        "UseRFoG": false,
        "UseRFoGModem": false,
        "UserConfigVer": 6,
        "UserInterface": {
          "DimLcdTimeout": 300,
          "DistanceUnits": "Meters",
          "FlashlightTimeout": 30,
          "GoToMenu": "NoFunction",
          "JobIdLength": 6,
          "KeyBeeps": true,
          "KeyDelay": 300,
          "KeyRate": 50,
          "Language": "",
          "LowPowerTimeout": 600,
          "SmallIcons": false,
          "TemperatureUnits": "Celsius",
          "TurnOffTimeout": 3600,
          "UserKey1": "NoFunction",
          "UserKey2": "NoFunction"
        },
        "UserName": "eads-us",
        "WebFirmwarePath": "http://viewpoint.trilithic.com/Connect/Data/Firmware",
        "WiFiSettings": {
          "PromptUser": true,
          "WiFiApLoginCount": [
            0,
            0,
            0,
            0,
            0,
            0
          ],
          "WiFiPassword": "",
          "WiFiPasswordMemory": [
            "",
            "",
            "",
            "",
            "",
            ""
          ],
          "WiFiSecurity": "Auto",
          "WiFiSecurityTypeMemory": [
            "Auto",
            "Auto",
            "Auto",
            "Auto",
            "Auto",
            "Auto"
          ],
          "WiFiSsid": "default",
          "WiFiSsidMemory": [
            "",
            "",
            "",
            "",
            "",
            ""
          ]
        }
      }
    },
  "ChannelPlans": [
    {
      "AllowSync": true,
      "Channels": [
        {
          "Id": "583593d5-364d-4245-85df-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 2,
          "CenterFrequency": 57000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 59750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 55250000
          },
          "ReadOnly": false
        },
        {
          "Id": "a90db46c-5bea-402c-8a39-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 3,
          "CenterFrequency": 63000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": true,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 65750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 61250000
          },
          "ReadOnly": false
        },
        {
          "Id": "9d225d67-ac92-4ce9-a7ef-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 4,
          "CenterFrequency": 69000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 71750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 67250000
          },
          "ReadOnly": false
        },
        {
          "Id": "4d5f0ba8-5da2-4e86-8406-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 5,
          "CenterFrequency": 79000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": true,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 81750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 77250000
          },
          "ReadOnly": false
        },
        {
          "Id": "9ae9d078-87f6-4494-95a5-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 6,
          "CenterFrequency": 85000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 87750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 83250000
          },
          "ReadOnly": false
        },
        {
          "Id": "6cc832a7-5ec3-47e0-8575-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 95,
          "CenterFrequency": 93000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 95750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 91250000
          },
          "ReadOnly": false
        },
        {
          "Id": "0c797362-56c0-4bf7-9e21-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 96,
          "CenterFrequency": 99000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 101750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 97250000
          },
          "ReadOnly": false
        },
        {
          "Id": "b73acd06-42b2-4819-ac25-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 97,
          "CenterFrequency": 105000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 107750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 103250000
          },
          "ReadOnly": false
        },
        {
          "Id": "48376af3-5910-4454-bc6a-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 98,
          "CenterFrequency": 111000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 113750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 109250000
          },
          "ReadOnly": false
        },
        {
          "Id": "7840017f-7410-44e3-8809-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 99,
          "CenterFrequency": 117000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 119750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 115250000
          },
          "ReadOnly": false
        },
        {
          "Id": "7328146b-643d-47d7-a0df-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 14,
          "CenterFrequency": 123000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 125750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 121250000
          },
          "ReadOnly": false
        },
        {
          "Id": "2bd8c53c-96f2-4688-abd5-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 15,
          "CenterFrequency": 129000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 131750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 127250000
          },
          "ReadOnly": false
        },
        {
          "Id": "eb56ba34-b14c-46a6-8007-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 16,
          "CenterFrequency": 135000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 137750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 133250000
          },
          "ReadOnly": false
        },
        {
          "Id": "700b9d42-4620-44af-a3b8-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 17,
          "CenterFrequency": 141000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 143750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 139250000
          },
          "ReadOnly": false
        },
        {
          "Id": "4e93960b-147f-4852-be8f-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 18,
          "CenterFrequency": 147000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 149750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 145250000
          },
          "ReadOnly": false
        },
        {
          "Id": "2ed08a4e-44f4-4ca4-9740-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 19,
          "CenterFrequency": 153000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 155750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 151250000
          },
          "ReadOnly": false
        },
        {
          "Id": "e60a2a49-c540-44d9-b332-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 20,
          "CenterFrequency": 159000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 161750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 157250000
          },
          "ReadOnly": false
        },
        {
          "Id": "5d6de430-6959-48ed-a7ff-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 21,
          "CenterFrequency": 165000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 167750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 163250000
          },
          "ReadOnly": false
        },
        {
          "Id": "ad41f6cf-dd9a-4374-8ae5-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 22,
          "CenterFrequency": 171000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 173750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 169250000
          },
          "ReadOnly": false
        },
        {
          "Id": "c4b388ee-7d9a-4e8c-8331-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 7,
          "CenterFrequency": 177000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 179750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 175250000
          },
          "ReadOnly": false
        },
        {
          "Id": "e5c9cfb4-fd29-40d8-a561-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 8,
          "CenterFrequency": 183000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 185750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 181250000
          },
          "ReadOnly": false
        },
        {
          "Id": "bf6abdc0-c525-4a25-8ee1-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 9,
          "CenterFrequency": 189000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 191750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 187250000
          },
          "ReadOnly": false
        },
        {
          "Id": "8d2b1b19-afca-4277-a576-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 10,
          "CenterFrequency": 195000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 197750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 193250000
          },
          "ReadOnly": false
        },
        {
          "Id": "7a5267ce-86a5-4b0d-9e5f-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 11,
          "CenterFrequency": 201000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 203750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 199250000
          },
          "ReadOnly": false
        },
        {
          "Id": "8cdcf53e-0790-48db-9570-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 12,
          "CenterFrequency": 207000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 209750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 205250000
          },
          "ReadOnly": false
        },
        {
          "Id": "ceb33e08-7543-4b52-a8e0-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 13,
          "CenterFrequency": 213000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 215750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 211250000
          },
          "ReadOnly": false
        },
        {
          "Id": "098825ab-1384-47b8-88c2-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 23,
          "CenterFrequency": 219000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 221750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 217250000
          },
          "ReadOnly": false
        },
        {
          "Id": "7c4f4aef-0245-4cf3-915d-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 24,
          "CenterFrequency": 225000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 227750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 223250000
          },
          "ReadOnly": false
        },
        {
          "Id": "be2ad352-60ca-41e6-ac44-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 25,
          "CenterFrequency": 231000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 233750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 229250000
          },
          "ReadOnly": false
        },
        {
          "Id": "e82507c6-4de2-49e0-b450-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 26,
          "CenterFrequency": 237000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 239750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 235250000
          },
          "ReadOnly": false
        },
        {
          "Id": "9150b9b2-35ea-4283-81f6-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 27,
          "CenterFrequency": 243000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 245750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 241250000
          },
          "ReadOnly": false
        },
        {
          "Id": "fe01359d-5920-45df-bc4c-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 28,
          "CenterFrequency": 249000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 251750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 247250000
          },
          "ReadOnly": false
        },
        {
          "Id": "96134df6-606b-4f76-8f9f-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 29,
          "CenterFrequency": 255000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 257750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 253250000
          },
          "ReadOnly": false
        },
        {
          "Id": "71a1b2bc-ce01-478f-800f-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 30,
          "CenterFrequency": 261000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 263750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 259250000
          },
          "ReadOnly": false
        },
        {
          "Id": "09b4b5c6-5be7-4381-ad49-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 31,
          "CenterFrequency": 267000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 269750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 265250000
          },
          "ReadOnly": false
        },
        {
          "Id": "d963b1c7-ac35-43a7-94b6-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 32,
          "CenterFrequency": 273000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 275750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 271250000
          },
          "ReadOnly": false
        },
        {
          "Id": "6a83b9ac-3e4e-4b42-9512-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 33,
          "CenterFrequency": 279000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 281750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 277250000
          },
          "ReadOnly": false
        },
        {
          "Id": "6daa4930-ef3d-410a-91cd-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 34,
          "CenterFrequency": 285000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 287750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 283250000
          },
          "ReadOnly": false
        },
        {
          "Id": "4a9d5f51-4f23-40d2-8b5e-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 35,
          "CenterFrequency": 291000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 293750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 289250000
          },
          "ReadOnly": false
        },
        {
          "Id": "1c3be5b5-6d5e-49e2-bdc4-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 36,
          "CenterFrequency": 297000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 299750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 295250000
          },
          "ReadOnly": false
        },
        {
          "Id": "b180a7de-8a15-45af-8459-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 37,
          "CenterFrequency": 303000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 305750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 301250000
          },
          "ReadOnly": false
        },
        {
          "Id": "6f7853f8-9493-4a9f-9554-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 38,
          "CenterFrequency": 309000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 311750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 307250000
          },
          "ReadOnly": false
        },
        {
          "Id": "1a2c7a39-5a2e-4d23-aa6b-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 39,
          "CenterFrequency": 315000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 317750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 313250000
          },
          "ReadOnly": false
        },
        {
          "Id": "719c13d7-7fb8-484f-91d1-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 40,
          "CenterFrequency": 321000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 323750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 319250000
          },
          "ReadOnly": false
        },
        {
          "Id": "148cc6df-9487-4a71-84af-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 41,
          "CenterFrequency": 327000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 329750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 325250000
          },
          "ReadOnly": false
        },
        {
          "Id": "0df2a487-6541-4299-9b95-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 42,
          "CenterFrequency": 333000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 335750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 331250000
          },
          "ReadOnly": false
        },
        {
          "Id": "5cdb9c98-6382-4fa4-94c9-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 43,
          "CenterFrequency": 339000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 341750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 337250000
          },
          "ReadOnly": false
        },
        {
          "Id": "a8a7725a-43b8-4fa8-9db1-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 44,
          "CenterFrequency": 345000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 347750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 343250000
          },
          "ReadOnly": false
        },
        {
          "Id": "f939a00b-0375-4e26-bc37-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 45,
          "CenterFrequency": 351000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 353750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 349250000
          },
          "ReadOnly": false
        },
        {
          "Id": "ac05f588-6157-4960-bc9c-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 46,
          "CenterFrequency": 357000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 359750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 355250000
          },
          "ReadOnly": false
        },
        {
          "Id": "248d91e6-0042-470a-b313-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 47,
          "CenterFrequency": 363000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 365750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 361250000
          },
          "ReadOnly": false
        },
        {
          "Id": "4a873a0e-5fed-46ba-8413-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 48,
          "CenterFrequency": 369000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 371750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 367250000
          },
          "ReadOnly": false
        },
        {
          "Id": "68baa617-e9df-47b2-99c0-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 49,
          "CenterFrequency": 375000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 377750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 373250000
          },
          "ReadOnly": false
        },
        {
          "Id": "6b1e76c5-dc4c-467c-b2ea-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 50,
          "CenterFrequency": 381000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 383750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 379250000
          },
          "ReadOnly": false
        },
        {
          "Id": "35e4847e-4389-48fd-b8fc-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 51,
          "CenterFrequency": 387000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 389750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 385250000
          },
          "ReadOnly": false
        },
        {
          "Id": "80f5df37-ce52-4d86-a4a5-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 52,
          "CenterFrequency": 393000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 395750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 391250000
          },
          "ReadOnly": false
        },
        {
          "Id": "8759e39d-1de7-4c77-bc17-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 53,
          "CenterFrequency": 399000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 401750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 397250000
          },
          "ReadOnly": false
        },
        {
          "Id": "60312701-3daa-40fa-b70f-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 54,
          "CenterFrequency": 405000000,
          "Bandwidth": 6000000,
          "Preset": "NTSC",
          "Type": "Analog",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": 407750000,
            "Modulation": null,
            "Standard": "NTSC",
            "SymbolRate": null,
            "VideoFrequency": 403250000
          },
          "ReadOnly": false
        },
        {
          "Id": "65d4dbb6-ee63-4c72-a14e-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 55,
          "CenterFrequency": 411000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "1dcd66c6-1355-454b-9942-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 56,
          "CenterFrequency": 417000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "30fe459a-7c2d-417f-89df-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 57,
          "CenterFrequency": 423000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "9e12eb77-5aa3-4d82-b30a-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 58,
          "CenterFrequency": 429000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "207ce21e-45fb-4390-b01b-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 59,
          "CenterFrequency": 435000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "3d9b6fc2-ff0d-4075-9fc6-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 60,
          "CenterFrequency": 441000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "14058581-9f14-4ca4-a2de-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 61,
          "CenterFrequency": 447000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "89410b45-967d-44de-b17e-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 62,
          "CenterFrequency": 453000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "966684e8-3248-4397-ab12-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 63,
          "CenterFrequency": 459000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "c1cdadaa-3664-41df-acd0-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 64,
          "CenterFrequency": 465000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "47c2294a-ba96-48c8-9619-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 65,
          "CenterFrequency": 471000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "bc592138-1ccc-43be-8475-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 66,
          "CenterFrequency": 477000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "c041fb96-1c97-4940-8070-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 67,
          "CenterFrequency": 483000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "26b2efbe-39a5-4b5b-9b6b-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 68,
          "CenterFrequency": 489000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "554eee1a-ba40-48a4-a44c-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 69,
          "CenterFrequency": 495000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "b816010e-aa6f-4941-8fe4-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 70,
          "CenterFrequency": 501000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "6dd9d3e4-5367-4061-8c21-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 71,
          "CenterFrequency": 507000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "3bc58669-1fba-442f-9628-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 72,
          "CenterFrequency": 513000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "e4f33181-7fd8-4cc9-b22f-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 73,
          "CenterFrequency": 519000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "3eb2f08d-ab0a-4a23-b3b0-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 74,
          "CenterFrequency": 525000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "3243dd52-a463-4018-89c1-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 75,
          "CenterFrequency": 531000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "1821bfb3-9dc0-4e88-9ec8-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 76,
          "CenterFrequency": 537000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "f6242e92-ab58-4f46-bfe5-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 77,
          "CenterFrequency": 543000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "440811e3-3c30-4969-84c5-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 78,
          "CenterFrequency": 549000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "efdbd233-6dbd-416a-ab00-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 79,
          "CenterFrequency": 555000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "5220bac3-c0cb-43f9-9070-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 80,
          "CenterFrequency": 561000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "ab52632e-4b8e-47de-97d1-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 81,
          "CenterFrequency": 567000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "1803f9bb-91f2-4847-ac92-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 82,
          "CenterFrequency": 573000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "45869845-e128-41bc-8c26-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 83,
          "CenterFrequency": 579000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "a98a8769-3556-43c6-928c-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 84,
          "CenterFrequency": 585000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "00a5614c-7050-46ac-829c-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 85,
          "CenterFrequency": 591000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "37a99ae3-3cf2-4759-96bd-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 86,
          "CenterFrequency": 597000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "6bb9f9d1-4b0a-4c8e-a698-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 87,
          "CenterFrequency": 603000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "76620c6b-667b-45f6-9c0e-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 88,
          "CenterFrequency": 609000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "b2b19520-88d7-41e8-8443-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 89,
          "CenterFrequency": 615000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "626ee834-c97a-4d10-a06c-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 90,
          "CenterFrequency": 621000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "afac7593-c03c-4786-9563-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 91,
          "CenterFrequency": 627000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "a72813f3-3f84-42c6-8d4c-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 92,
          "CenterFrequency": 633000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "c69ddde5-7984-46d4-a067-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 93,
          "CenterFrequency": 639000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "d9dba1cf-87ed-4f6a-a857-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 94,
          "CenterFrequency": 645000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "5035547f-7af4-4cbd-9a70-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 100,
          "CenterFrequency": 651000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "b7b07f9b-c031-4920-924c-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 101,
          "CenterFrequency": 657000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "1f54f63e-0853-49a2-81ad-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 102,
          "CenterFrequency": 663000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "39da3d64-992e-496d-8a7f-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 103,
          "CenterFrequency": 669000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "e7ee2ed5-2222-423a-89ee-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 104,
          "CenterFrequency": 675000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "3c051ec6-c97c-4596-830d-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 105,
          "CenterFrequency": 681000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "3977e7a5-c95c-4984-9084-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 106,
          "CenterFrequency": 687000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "85ed244a-6dfa-439f-8d64-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 107,
          "CenterFrequency": 693000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "3d844490-0bc9-4afe-845a-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 108,
          "CenterFrequency": 699000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "c722eaa2-cc3a-46f7-a1c4-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 109,
          "CenterFrequency": 705000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "5e30d047-f212-43b6-8dfc-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 110,
          "CenterFrequency": 711000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "918c5315-f6f1-411a-8fc3-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 111,
          "CenterFrequency": 717000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "d92b2ea2-2788-4c1e-9c5a-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 112,
          "CenterFrequency": 723000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "f9d6bb8c-c210-4564-8ecc-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 113,
          "CenterFrequency": 729000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "ba3c4477-5523-4852-8b66-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 114,
          "CenterFrequency": 735000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "93b6e0e5-55d2-4b92-a9dc-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 115,
          "CenterFrequency": 741000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "99fc6f42-c16a-485c-8fa6-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 116,
          "CenterFrequency": 747000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "ddd7451d-dead-4db9-bbdc-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 117,
          "CenterFrequency": 753000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "25166896-c3d6-4ba4-95a7-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 118,
          "CenterFrequency": 759000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "94bb252b-2683-40d8-bd5f-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 119,
          "CenterFrequency": 765000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "bcdd310d-d98b-4c73-b8d3-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 120,
          "CenterFrequency": 771000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "00401c95-477f-4add-8fb2-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 121,
          "CenterFrequency": 777000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "c63bc250-070b-425d-b842-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 122,
          "CenterFrequency": 783000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "bfa83b1b-862e-48aa-b8e3-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 123,
          "CenterFrequency": 789000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "fffad770-10b5-4cb3-8312-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 124,
          "CenterFrequency": 795000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "5a27cb82-0682-4214-97c1-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 125,
          "CenterFrequency": 801000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "cc62d19a-bf95-4d13-9f40-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 126,
          "CenterFrequency": 807000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "1da233b4-2b95-4907-97a8-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 127,
          "CenterFrequency": 813000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "39cadf21-9655-4b00-ae76-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 128,
          "CenterFrequency": 819000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "434d6e82-48b9-4cb6-88bc-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 129,
          "CenterFrequency": 825000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "82156c99-120d-4441-8eb1-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 130,
          "CenterFrequency": 831000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "d32a91d8-9ac4-4ee7-bf5f-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 131,
          "CenterFrequency": 837000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "46184a62-acbc-4e36-92fb-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 132,
          "CenterFrequency": 843000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "a506bda2-5ffe-43a5-b6f8-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 133,
          "CenterFrequency": 849000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "2cf862af-ce52-4234-94dc-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 134,
          "CenterFrequency": 855000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "a97b78ac-6d96-4680-8047-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 135,
          "CenterFrequency": 861000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "181332d8-f335-4430-9d72-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 136,
          "CenterFrequency": 867000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "be54ef2b-e540-4c73-b501-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 137,
          "CenterFrequency": 873000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "84e49cff-182f-4a76-9b08-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 138,
          "CenterFrequency": 879000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "24f39075-5781-4ff3-a5ea-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 139,
          "CenterFrequency": 885000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "c08ff91d-510b-40e9-9900-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 140,
          "CenterFrequency": 891000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "5139352c-2598-4a4b-a917-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 141,
          "CenterFrequency": 897000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "ba60a233-536c-49b2-a7a2-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 142,
          "CenterFrequency": 903000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "704be187-ce54-4e95-a1d3-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 143,
          "CenterFrequency": 909000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "92c0dcbd-621c-45d0-9c3f-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 144,
          "CenterFrequency": 915000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "adb465b8-6395-4df9-9ab5-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 145,
          "CenterFrequency": 921000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "83f47631-9f68-4a47-a4f6-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 145,
          "CenterFrequency": 921000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "03f7285f-9c51-4fd1-b6e4-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 146,
          "CenterFrequency": 927000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "e3c72335-7695-4d6e-90a1-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 147,
          "CenterFrequency": 933000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "97b2814c-4c27-4ebf-a08b-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 148,
          "CenterFrequency": 939000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "c170daf9-b5ef-41aa-99d9-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 149,
          "CenterFrequency": 945000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "cad92145-625b-430b-a554-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 150,
          "CenterFrequency": 951000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "048fe897-f3b2-47d7-bcfb-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 151,
          "CenterFrequency": 957000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "9137587a-0e08-456b-b677-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 152,
          "CenterFrequency": 963000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "6c5c6cd3-59f3-447c-aa97-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 153,
          "CenterFrequency": 969000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "b34b9a78-4858-4fc4-8fb9-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 154,
          "CenterFrequency": 975000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "eef728ec-587e-4b9c-b0ee-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 155,
          "CenterFrequency": 981000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "08cca688-670d-40cb-bf0e-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 156,
          "CenterFrequency": 987000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "60f15dd6-5ee5-49ea-bc72-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 157,
          "CenterFrequency": 993000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "b7fdde44-8c42-46eb-a91c-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 158,
          "CenterFrequency": 999000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        },
        {
          "Id": "563443d7-2879-4acf-b0e1-a82b00dc2518",
          "Name": "",
          "ChannelNumber": 159,
          "CenterFrequency": 1005000000,
          "Bandwidth": 6000000,
          "Preset": "Dig Vid 256",
          "Type": "Digital",
          "IsDisabled": false,
          "IsFavorite": false,
          "SkipLimitCheck": false,
          "Configuration": {
            "AudioFrequency": null,
            "Modulation": "256QAM",
            "Standard": "AnnexB",
            "SymbolRate": 5360537,
            "VideoFrequency": null
          },
          "ReadOnly": false
        }
      ],
      "LocationTestPlans": [
        {
          "Id": "904449dd-85bc-49f0-ba5c-a82b00dc2518",
          "TestLocation": "Outlet",
          "LimitSetRefId": "050c53b3-7aa2-408f-8599-a412ccd53c1a",
          "LimitSetId": "fcfeb440-3bbf-4cce-a4ce-a83200cebca1",
          "TestParams": [
            {
              "ChannelId": "00000000-0000-0000-0000-000000000000",
              "IsDisabled": false,
              "Measurements": [
                "LaunchLevel",
                "DigitalLevel"
              ],
              "Name": "Modem"
            },
            {
              "IsDisabled": true,
              "Measurements": [
                "IngressLevel"
              ],
              "Name": "Spectrum",
              "StartFrequency": 4000000,
              "StopFrequency": 65000000
            },
            {
              "Channels": [
                {
                  "ChannelId": "583593d5-364d-4245-85df-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "a90db46c-5bea-402c-8a39-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta",
                    "C2NLevel",
                    "HumFundamental"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "9d225d67-ac92-4ce9-a7ef-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "4d5f0ba8-5da2-4e86-8406-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "9ae9d078-87f6-4494-95a5-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "6cc832a7-5ec3-47e0-8575-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "0c797362-56c0-4bf7-9e21-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "b73acd06-42b2-4819-ac25-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "48376af3-5910-4454-bc6a-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "7840017f-7410-44e3-8809-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "7328146b-643d-47d7-a0df-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "2bd8c53c-96f2-4688-abd5-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "eb56ba34-b14c-46a6-8007-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "700b9d42-4620-44af-a3b8-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "4e93960b-147f-4852-be8f-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "2ed08a4e-44f4-4ca4-9740-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "e60a2a49-c540-44d9-b332-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "5d6de430-6959-48ed-a7ff-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "ad41f6cf-dd9a-4374-8ae5-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "c4b388ee-7d9a-4e8c-8331-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "e5c9cfb4-fd29-40d8-a561-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "bf6abdc0-c525-4a25-8ee1-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "8d2b1b19-afca-4277-a576-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "7a5267ce-86a5-4b0d-9e5f-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "8cdcf53e-0790-48db-9570-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "ceb33e08-7543-4b52-a8e0-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "098825ab-1384-47b8-88c2-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "7c4f4aef-0245-4cf3-915d-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "be2ad352-60ca-41e6-ac44-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "e82507c6-4de2-49e0-b450-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "9150b9b2-35ea-4283-81f6-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "fe01359d-5920-45df-bc4c-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "96134df6-606b-4f76-8f9f-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "71a1b2bc-ce01-478f-800f-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "09b4b5c6-5be7-4381-ad49-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "d963b1c7-ac35-43a7-94b6-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "6a83b9ac-3e4e-4b42-9512-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "6daa4930-ef3d-410a-91cd-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "4a9d5f51-4f23-40d2-8b5e-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "1c3be5b5-6d5e-49e2-bdc4-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "b180a7de-8a15-45af-8459-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "6f7853f8-9493-4a9f-9554-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "1a2c7a39-5a2e-4d23-aa6b-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "719c13d7-7fb8-484f-91d1-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "148cc6df-9487-4a71-84af-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "0df2a487-6541-4299-9b95-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "5cdb9c98-6382-4fa4-94c9-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "a8a7725a-43b8-4fa8-9db1-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "f939a00b-0375-4e26-bc37-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "ac05f588-6157-4960-bc9c-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "248d91e6-0042-470a-b313-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "4a873a0e-5fed-46ba-8413-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "68baa617-e9df-47b2-99c0-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "6b1e76c5-dc4c-467c-b2ea-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "35e4847e-4389-48fd-b8fc-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "80f5df37-ce52-4d86-a4a5-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "8759e39d-1de7-4c77-bc17-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "60312701-3daa-40fa-b70f-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "VideoLevel",
                    "VideoAudioDelta"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "65d4dbb6-ee63-4c72-a14e-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "1dcd66c6-1355-454b-9942-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "30fe459a-7c2d-417f-89df-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "9e12eb77-5aa3-4d82-b30a-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "207ce21e-45fb-4390-b01b-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "3d9b6fc2-ff0d-4075-9fc6-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "14058581-9f14-4ca4-a2de-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "89410b45-967d-44de-b17e-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "966684e8-3248-4397-ab12-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "c1cdadaa-3664-41df-acd0-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "47c2294a-ba96-48c8-9619-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "bc592138-1ccc-43be-8475-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel",
                    "Mer256Qam",
                    "PreBitError",
                    "PostBitError"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "c041fb96-1c97-4940-8070-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "26b2efbe-39a5-4b5b-9b6b-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "554eee1a-ba40-48a4-a44c-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "b816010e-aa6f-4941-8fe4-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "6dd9d3e4-5367-4061-8c21-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "3bc58669-1fba-442f-9628-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "e4f33181-7fd8-4cc9-b22f-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "3eb2f08d-ab0a-4a23-b3b0-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "3243dd52-a463-4018-89c1-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "1821bfb3-9dc0-4e88-9ec8-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "f6242e92-ab58-4f46-bfe5-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "440811e3-3c30-4969-84c5-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "efdbd233-6dbd-416a-ab00-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "5220bac3-c0cb-43f9-9070-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "ab52632e-4b8e-47de-97d1-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "1803f9bb-91f2-4847-ac92-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "45869845-e128-41bc-8c26-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "a98a8769-3556-43c6-928c-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "00a5614c-7050-46ac-829c-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "37a99ae3-3cf2-4759-96bd-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "6bb9f9d1-4b0a-4c8e-a698-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "76620c6b-667b-45f6-9c0e-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "b2b19520-88d7-41e8-8443-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "626ee834-c97a-4d10-a06c-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "afac7593-c03c-4786-9563-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "a72813f3-3f84-42c6-8d4c-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "c69ddde5-7984-46d4-a067-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "d9dba1cf-87ed-4f6a-a857-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "5035547f-7af4-4cbd-9a70-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "b7b07f9b-c031-4920-924c-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "1f54f63e-0853-49a2-81ad-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "39da3d64-992e-496d-8a7f-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "e7ee2ed5-2222-423a-89ee-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "3c051ec6-c97c-4596-830d-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "3977e7a5-c95c-4984-9084-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "85ed244a-6dfa-439f-8d64-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "3d844490-0bc9-4afe-845a-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "c722eaa2-cc3a-46f7-a1c4-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "5e30d047-f212-43b6-8dfc-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "918c5315-f6f1-411a-8fc3-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "d92b2ea2-2788-4c1e-9c5a-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "f9d6bb8c-c210-4564-8ecc-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "ba3c4477-5523-4852-8b66-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "93b6e0e5-55d2-4b92-a9dc-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "99fc6f42-c16a-485c-8fa6-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "ddd7451d-dead-4db9-bbdc-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "25166896-c3d6-4ba4-95a7-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "94bb252b-2683-40d8-bd5f-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "bcdd310d-d98b-4c73-b8d3-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "00401c95-477f-4add-8fb2-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "c63bc250-070b-425d-b842-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "bfa83b1b-862e-48aa-b8e3-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "fffad770-10b5-4cb3-8312-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "5a27cb82-0682-4214-97c1-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "cc62d19a-bf95-4d13-9f40-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "1da233b4-2b95-4907-97a8-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "39cadf21-9655-4b00-ae76-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "434d6e82-48b9-4cb6-88bc-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "82156c99-120d-4441-8eb1-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "d32a91d8-9ac4-4ee7-bf5f-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "46184a62-acbc-4e36-92fb-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "a506bda2-5ffe-43a5-b6f8-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "2cf862af-ce52-4234-94dc-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "a97b78ac-6d96-4680-8047-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "181332d8-f335-4430-9d72-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "be54ef2b-e540-4c73-b501-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "84e49cff-182f-4a76-9b08-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "24f39075-5781-4ff3-a5ea-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "c08ff91d-510b-40e9-9900-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "5139352c-2598-4a4b-a917-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "ba60a233-536c-49b2-a7a2-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "704be187-ce54-4e95-a1d3-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "92c0dcbd-621c-45d0-9c3f-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "83f47631-9f68-4a47-a4f6-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "adb465b8-6395-4df9-9ab5-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "03f7285f-9c51-4fd1-b6e4-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "e3c72335-7695-4d6e-90a1-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "97b2814c-4c27-4ebf-a08b-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "c170daf9-b5ef-41aa-99d9-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "cad92145-625b-430b-a554-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "048fe897-f3b2-47d7-bcfb-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "9137587a-0e08-456b-b677-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "6c5c6cd3-59f3-447c-aa97-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "b34b9a78-4858-4fc4-8fb9-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "eef728ec-587e-4b9c-b0ee-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "08cca688-670d-40cb-bf0e-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "60f15dd6-5ee5-49ea-bc72-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "b7fdde44-8c42-46eb-a91c-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                },
                {
                  "ChannelId": "563443d7-2879-4acf-b0e1-a82b00dc2518",
                  "IsDisabled": false,
                  "Measurements": [
                    "DigitalLevel"
                  ],
                  "SkipLimitCheck": false
                }
              ],
              "IsDisabled": false,
              "Measurements": [
                "AdjacentVideoLevel",
                "VideoDelta",
                "VideoDigitalDelta"
              ],
              "Name": "Scan",
              "TiltChannels": []
            }
          ],
          "Device860Attrs": {},
          "ReadOnly": false
        }
      ],
      "Origin": "NotAService",
      "Device360Attrs": {},
      "Device860Attrs": {},
      "RefId": "7eed9275-49cd-4721-b99a-a81e00f5ebcf",
      "IsDisabled": false,
      "Name": "ncta",
      "OrganizationalRefs": [
        {
          "ItemId": "7eed9275-49cd-4721-b99a-a81e00f5ebcf",
          "Type": "Trilithic.Entity.SLM.ChannelPlan",
          "OrganizationalNodeId": "2b32ad69-8a85-413e-9528-3c87e9f8be0d",
          "OrganizationalNode": {
            "Name": "Organization",
            "Type": "Root",
            "CreatedTime": "2017-10-27T20:42:14Z",
            "IsDisabled": false,
            "Depth": 0,
            "Path": "/Organization",
            "UpdatedInViewPoint": false,
            "Attributes": {},
            "ParentId": "00000000-0000-0000-0000-000000000000",
            "HasAChild": false,
            "HasUserDefinedLocation": false,
            "ModUserName": "System",
            "ModTime": "2017-10-27T20:42:14Z",
            "Id": "4ef81da4-66e5-4b47-a83d-9a80261dd547",
            "ReadOnly": false
          },
          "Id": "17fdcbd0-2640-401a-9443-615239b477cf",
          "ReadOnly": false
        }
      ],
      "Attributes": {},
      "ModUserName": "admin",
      "ModTime": "2017-11-14T18:21:31Z",
      "Id": "e513893f-0dd7-4393-a551-9a57db3f2e08",
      "ReadOnly": false
    }
  ],
  "LimitSets": [
    {
      "AllowSync": true,
      "Limits": [
        {
          "MaxValue": 26,
          "Measurement": "VideoLevel",
          "MinValue": 8
        },
        {
          "MaxValue": 3,
          "Measurement": "AdjacentVideoLevel"
        },
        {
          "MaxValue": 18,
          "Measurement": "VideoAudioDelta",
          "MinValue": 10
        },
        {
          "MaxValue": 14,
          "Measurement": "VideoDelta"
        },
        {
          "MaxValue": 30,
          "Measurement": "VideoDigitalDelta"
        },
        {
          "MaxValue": 20,
          "Measurement": "DigitalLevel",
          "MinValue": 2
        },
        {
          "Measurement": "Mer64Qam",
          "MinValue": 28
        },
        {
          "Measurement": "Mer256Qam",
          "MinValue": 34
        },
        {
          "Measurement": "Mer128Qam",
          "MinValue": 33
        },
        {
          "MaxValue": 1e-9,
          "Measurement": "PreBitError"
        },
        {
          "MaxValue": 1e-7,
          "Measurement": "PostBitError"
        },
        {
          "MaxValue": 44,
          "Measurement": "LaunchLevel",
          "MinValue": 30
        },
        {
          "Measurement": "C2NLevel",
          "MinValue": 20
        }
      ],
      "Origin": "NotAService",
      "RefId": "050c53b3-7aa2-408f-8599-a412ccd53c1a",
      "IsDisabled": false,
      "Name": "Tap",
      "OrganizationalRefs": [
        {
          "ItemId": "050c53b3-7aa2-408f-8599-a412ccd53c1a",
          "Type": "Trilithic.Entity.SLM.LimitSet",
          "OrganizationalNodeId": "4ef81da4-66e5-4b47-a83d-9a80261dd547",
          "OrganizationalNode": {
            "Name": "Organization",
            "Type": "Root",
            "CreatedTime": "2017-10-27T20:42:14Z",
            "IsDisabled": false,
            "Depth": 0,
            "Path": "/Organization",
            "UpdatedInViewPoint": false,
            "ParentId": "00000000-0000-0000-0000-000000000000",
            "HasAChild": false,
            "HasUserDefinedLocation": false,
            "ModUserName": "System",
            "ModTime": "2017-10-27T20:42:14Z",
            "Id": "4ef81da4-66e5-4b47-a83d-9a80261dd547",
            "ReadOnly": false
          },
          "Id": "594cdd7c-39f6-46f6-8cbb-48e1b2c8bf77",
          "ReadOnly": false
        }
      ],
      "Attributes": {},
      "ModUserName": "admin",
      "ModTime": "2017-11-21T17:32:41Z",
      "Id": "fcfeb440-3bbf-4cce-a4ce-a83200cebca1",
      "ReadOnly": false
    },
    {
      "AllowSync": true,
      "Limits": [
        {
          "MaxValue": 14,
          "Measurement": "VideoLevel",
          "MinValue": -3
        },
        {
          "MaxValue": 18,
          "Measurement": "VideoAudioDelta",
          "MinValue": 10
        },
        {
          "MaxValue": 3,
          "Measurement": "AdjacentVideoLevel"
        },
        {
          "MaxValue": 12,
          "Measurement": "VideoDelta"
        },
        {
          "MaxValue": 20,
          "Measurement": "VideoDigitalDelta"
        },
        {
          "MaxValue": 10,
          "Measurement": "DigitalLevel",
          "MinValue": -8
        },
        {
          "Measurement": "Mer128Qam",
          "MinValue": 33
        },
        {
          "Measurement": "Mer256Qam",
          "MinValue": 33
        },
        {
          "Measurement": "Mer64Qam",
          "MinValue": 28
        },
        {
          "MaxValue": 1e-9,
          "Measurement": "PreBitError"
        },
        {
          "MaxValue": 1e-9,
          "Measurement": "PostBitError"
        },
        {
          "MaxValue": 52,
          "Measurement": "LaunchLevel",
          "MinValue": 30
        },
        {
          "Measurement": "C2NLevel",
          "MinValue": 43
        }
      ],
      "Origin": "NotAService",
      "RefId": "9070d4f7-a80c-4de1-92dc-eabbfef9b5eb",
      "IsDisabled": false,
      "Name": "CPE-2",
      "OrganizationalRefs": [
        {
          "ItemId": "ba2e783f-daad-4776-a83a-35b56995ed4c",
          "Type": "Trilithic.Entity.SLM.LimitSet",
          "OrganizationalNodeId": "2b32ad69-8a85-413e-9528-3c87e9f8be0d",
          "OrganizationalNode": {
            "Name": "Organization",
            "Type": "Root",
            "CreatedTime": "2017-10-27T20:42:14Z",
            "IsDisabled": false,
            "Depth": 0,
            "Path": "/Organization",
            "UpdatedInViewPoint": false,
            "Attributes": {},
            "ParentId": "00000000-0000-0000-0000-000000000000",
            "HasAChild": false,
            "HasUserDefinedLocation": false,
            "ModUserName": "System",
            "ModTime": "2017-10-27T20:42:14Z",
            "Id": "4ef81da4-66e5-4b47-a83d-9a80261dd547",
            "ReadOnly": false
          },
          "Id": "2b30d3f6-246f-4e33-88d0-100244ad460f",
          "ReadOnly": false
        }
      ],
      "Attributes": {},
      "ModUserName": "admin",
      "ModTime": "2017-11-01T20:12:51Z",
      "Id": "305c428a-9a1d-4147-a1eb-786197103fe8",
      "ReadOnly": false
    }
  ],
  "AutoTests": [
    {
      "Id": "3ca35a98-06b4-40e6-8ad7-a57c00ddb88a",
      "Tests": [
        {
          "Allowed": true,
          "DisplayName": "Tap",
          "Name": "Tap"
        },
        {
          "Allowed": true,
          "DisplayName": "Drop",
          "Name": "Drop"
        },
        {
          "Allowed": true,
          "DisplayName": "Ground Block",
          "Name": "GroundBlock"
        },
        {
          "Allowed": true,
          "DisplayName": "Outlet",
          "Name": "Outlet",
          "Required": true
        }
      ],
      "AllowSync": true,
      "Periodic": false,
      "PeriodSeconds": 0,
      "PeriodNumTests": 0,
      "Name": "homecheck",
      "ModUserName": "admin",
      "ModTime": "2017-11-09T20:17:52Z",
      "OrganizationalRefs": [
        {
          "ItemId": "76ee2c9c-300c-40f3-91f3-a82600fbf140",
          "Type": "Trilithic.Entity.SLM.Autotest",
          "OrganizationalNodeId": "2b32ad69-8a85-413e-9528-3c87e9f8be0d",
          "OrganizationalNode": {
            "Id": "4ef81da4-66e5-4b47-a83d-9a80261dd547",
            "Name": "Organization",
            "Type": "Root",
            "CreatedTime": "2017-10-27T20:42:14Z",
            "IsDisabled": false,
            "Depth": 0,
            "UpdatedInViewPoint": false,
            "ParentId": "00000000-0000-0000-0000-000000000000",
            "HasUserDefinedLocation": false,
            "ModUserName": "System",
            "ModTime": "2017-10-27T20:42:14Z",
            "Path": "/Organization",
            "Attributes": {},
            "HasAChild": false,
            "ReadOnly": false
          },
          "Id": "8531579d-8954-4059-b030-a82600fc19c7",
          "ReadOnly": false
        }
      ],
      "Attributes": {},
      "ReadOnly": false
    }
  ],
  "Jobs": [
    {
      "Attributes": {
        "MeterStatus": "Open",
        "OpenTime": "2019-03-18T14:45:25Z"
      },
      "ChannelPlanId": "{e513893f-0dd7-4393-a551-9a57db3f2e08}",
      "Complete": false,
      "Id": "db4f94e6-a7b1-4386-8a1a-777d5d271af8",
      "Name": "123456",
      "TechId": "70529",
      "TestSetIds": [
        "5645d809-dc33-4de4-9556-8e1250bf2412",
        "3b9cf509-a2bd-4f8a-ad99-18d10121d511",
        "0e45f358-3e39-4d50-9f2b-595c808cb29c",
        "b21bf8d9-953a-45ca-8efa-e7fab9631a40",
        "b117792d-daa4-4828-86ea-f5fac03034de",
        "7e960a97-2a04-4a44-8304-451ab82d30c7"
      ]
    },
    {
      "Attributes": {
        "CloseTime": "2019-03-18T18:18:37Z",
        "MeterStatus": "Closed",
        "OpenTime": "2019-03-18T18:15:21Z"
      },
      "AutotestId": "3ca35a98-06b4-40e6-8ad7-a57c00ddb88a",
      "ChannelPlanId": "{e513893f-0dd7-4393-a551-9a57db3f2e08}",
      "Complete": true,
      "Id": "de37649e-74f8-40a0-a839-dc1381b90620",
      "Name": "246135",
      "TechId": "70529",
      "TestSetIds": [
        "705de19a-08a0-481f-a073-daab4bc846cc",
        "4191cf0c-596d-4314-a716-7813e68c8513",
        "6c9a6ccc-1807-40e9-b86c-3e7aab8e6a9a"
      ]
    }
  ],
  "TestSets": [
    {
      "Attributes": {
        "MenuName": "Scan",
        "MeterName": "246135-screen-1",
        "TechId": "70529"
      },
      "AutotestId": null,
      "BlobId": "c5a73533-58f4-4874-aa4d-2229df23837e",
      "BlobType": "image/png",
      "ChannelPlanId": null,
      "CpeMacAddress": "00:02:7C:01:D2:50",
      "Id": "4191cf0c-596d-4314-a716-7813e68c8513",
      "JobId": "de37649e-74f8-40a0-a839-dc1381b90620",
      "LimitSetId": null,
      "MeterId": null,
      "ModTime": null,
      "ModUserName": null,
      "Name": null,
      "OrganizationalNodeId": null,
      "ProcessTime": null,
      "ReadOnly": false,
      "Results": null,
      "SyncTime": "",
      "TestLocation": null,
      "TestLocationIndex": 0,
      "TestTime": "2019-03-18T18:16:52Z",
      "TestValues": [
        {
          "Attributes": null,
          "Channels": null,
          "Constellation": null,
          "MeasurementValues": null,
          "Measurements": null,
          "Name": "ScreenShot",
          "Spectrum": null
        }
      ],
      "UserName": "eads-us"
    },
    {
      "Attributes": {
        "MeterName": "",
        "TestPointLabel": ""
      },
      "ChannelPlanId": "e513893f-0dd7-4393-a551-9a57db3f2e08",
      "CompanyName": "VIAVI",
      "CpeMacAddress": "00:02:7C:01:D2:50",
      "Id": "6c9a6ccc-1807-40e9-b86c-3e7aab8e6a9a",
      "JobId": "de37649e-74f8-40a0-a839-dc1381b90620",
      "LimitSetId": "fcfeb440-3bbf-4cce-a4ce-a83200cebca1",
      "OpmLevel": "",
      "Results": {
        "Failed": true
      },
      "TechID": "70529",
      "TestLocation": "Outlet",
      "TestLocationIndex": 0,
      "TestTime": "2019-03-18T18:18:26Z",
      "TestValues": [
        {
          "Channels": [
            {
              "ChannelFrequency": 55250000,
              "ChannelId": "583593d5-364d-4245-85df-a82b00dc2518",
              "ChannelNumber": 2,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.47265625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -57.05859375
                }
              ]
            },
            {
              "ChannelFrequency": 61250000,
              "ChannelId": "a90db46c-5bea-402c-8a39-a82b00dc2518",
              "ChannelNumber": 3,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "C2NLevel",
                  "Results": {
                    "Failed": false
                  },
                  "Value": 20
                },
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 2.09375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.79296875
                }
              ]
            },
            {
              "ChannelFrequency": 67250000,
              "ChannelId": "9d225d67-ac92-4ce9-a7ef-a82b00dc2518",
              "ChannelNumber": 4,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.55859375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.80859375
                }
              ]
            },
            {
              "ChannelFrequency": 77250000,
              "ChannelId": "4d5f0ba8-5da2-4e86-8406-a82b00dc2518",
              "ChannelNumber": 5,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.6015625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.99609375
                }
              ]
            },
            {
              "ChannelFrequency": 83250000,
              "ChannelId": "9ae9d078-87f6-4494-95a5-a82b00dc2518",
              "ChannelNumber": 6,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.85546875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -57.17578125
                }
              ]
            },
            {
              "ChannelFrequency": 91250000,
              "ChannelId": "6cc832a7-5ec3-47e0-8575-a82b00dc2518",
              "ChannelNumber": 95,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.91796875
                }
              ]
            },
            {
              "ChannelFrequency": 97250000,
              "ChannelId": "0c797362-56c0-4bf7-9e21-a82b00dc2518",
              "ChannelNumber": 96,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.890625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.9375
                }
              ]
            },
            {
              "ChannelFrequency": 103250000,
              "ChannelId": "b73acd06-42b2-4819-ac25-a82b00dc2518",
              "ChannelNumber": 97,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.546875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.3359375
                }
              ]
            },
            {
              "ChannelFrequency": 109250000,
              "ChannelId": "48376af3-5910-4454-bc6a-a82b00dc2518",
              "ChannelNumber": 98,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.328125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.8046875
                }
              ]
            },
            {
              "ChannelFrequency": 115250000,
              "ChannelId": "7840017f-7410-44e3-8809-a82b00dc2518",
              "ChannelNumber": 99,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.0703125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.9296875
                }
              ]
            },
            {
              "ChannelFrequency": 121250000,
              "ChannelId": "7328146b-643d-47d7-a0df-a82b00dc2518",
              "ChannelNumber": 14,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.84375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.5625
                }
              ]
            },
            {
              "ChannelFrequency": 127250000,
              "ChannelId": "2bd8c53c-96f2-4688-abd5-a82b00dc2518",
              "ChannelNumber": 15,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.9453125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.5625
                }
              ]
            },
            {
              "ChannelFrequency": 133250000,
              "ChannelId": "eb56ba34-b14c-46a6-8007-a82b00dc2518",
              "ChannelNumber": 16,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.52734375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.63671875
                }
              ]
            },
            {
              "ChannelFrequency": 139250000,
              "ChannelId": "700b9d42-4620-44af-a3b8-a82b00dc2518",
              "ChannelNumber": 17,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.76171875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.8359375
                }
              ]
            },
            {
              "ChannelFrequency": 145250000,
              "ChannelId": "4e93960b-147f-4852-be8f-a82b00dc2518",
              "ChannelNumber": 18,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.0703125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.359375
                }
              ]
            },
            {
              "ChannelFrequency": 151250000,
              "ChannelId": "2ed08a4e-44f4-4ca4-9740-a82b00dc2518",
              "ChannelNumber": 19,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.70703125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.44140625
                }
              ]
            },
            {
              "ChannelFrequency": 157250000,
              "ChannelId": "e60a2a49-c540-44d9-b332-a82b00dc2518",
              "ChannelNumber": 20,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.46875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.78125
                }
              ]
            },
            {
              "ChannelFrequency": 163250000,
              "ChannelId": "5d6de430-6959-48ed-a7ff-a82b00dc2518",
              "ChannelNumber": 21,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.04296875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.02734375
                }
              ]
            },
            {
              "ChannelFrequency": 169250000,
              "ChannelId": "ad41f6cf-dd9a-4374-8ae5-a82b00dc2518",
              "ChannelNumber": 22,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.12109375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.359375
                }
              ]
            },
            {
              "ChannelFrequency": 175250000,
              "ChannelId": "c4b388ee-7d9a-4e8c-8331-a82b00dc2518",
              "ChannelNumber": 7,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.1015625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.78125
                }
              ]
            },
            {
              "ChannelFrequency": 181250000,
              "ChannelId": "e5c9cfb4-fd29-40d8-a561-a82b00dc2518",
              "ChannelNumber": 8,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.2109375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.6015625
                }
              ]
            },
            {
              "ChannelFrequency": 187250000,
              "ChannelId": "bf6abdc0-c525-4a25-8ee1-a82b00dc2518",
              "ChannelNumber": 9,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.39453125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.05078125
                }
              ]
            },
            {
              "ChannelFrequency": 193250000,
              "ChannelId": "8d2b1b19-afca-4277-a576-a82b00dc2518",
              "ChannelNumber": 10,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.69921875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.0546875
                }
              ]
            },
            {
              "ChannelFrequency": 199250000,
              "ChannelId": "7a5267ce-86a5-4b0d-9e5f-a82b00dc2518",
              "ChannelNumber": 11,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.0390625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.18359375
                }
              ]
            },
            {
              "ChannelFrequency": 205250000,
              "ChannelId": "8cdcf53e-0790-48db-9570-a82b00dc2518",
              "ChannelNumber": 12,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.73828125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.78125
                }
              ]
            },
            {
              "ChannelFrequency": 211250000,
              "ChannelId": "ceb33e08-7543-4b52-a8e0-a82b00dc2518",
              "ChannelNumber": 13,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.2421875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.90625
                }
              ]
            },
            {
              "ChannelFrequency": 217250000,
              "ChannelId": "098825ab-1384-47b8-88c2-a82b00dc2518",
              "ChannelNumber": 23,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.46484375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.16796875
                }
              ]
            },
            {
              "ChannelFrequency": 223250000,
              "ChannelId": "7c4f4aef-0245-4cf3-915d-a82b00dc2518",
              "ChannelNumber": 24,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.64453125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.9140625
                }
              ]
            },
            {
              "ChannelFrequency": 229250000,
              "ChannelId": "be2ad352-60ca-41e6-ac44-a82b00dc2518",
              "ChannelNumber": 25,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.80078125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.5859375
                }
              ]
            },
            {
              "ChannelFrequency": 235250000,
              "ChannelId": "e82507c6-4de2-49e0-b450-a82b00dc2518",
              "ChannelNumber": 26,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -0.03125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.44921875
                }
              ]
            },
            {
              "ChannelFrequency": 241250000,
              "ChannelId": "9150b9b2-35ea-4283-81f6-a82b00dc2518",
              "ChannelNumber": 27,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.7578125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.9609375
                }
              ]
            },
            {
              "ChannelFrequency": 247250000,
              "ChannelId": "fe01359d-5920-45df-bc4c-a82b00dc2518",
              "ChannelNumber": 28,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.89453125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.2109375
                }
              ]
            },
            {
              "ChannelFrequency": 253250000,
              "ChannelId": "96134df6-606b-4f76-8f9f-a82b00dc2518",
              "ChannelNumber": 29,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.2109375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.078125
                }
              ]
            },
            {
              "ChannelFrequency": 259250000,
              "ChannelId": "71a1b2bc-ce01-478f-800f-a82b00dc2518",
              "ChannelNumber": 30,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.73828125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.91796875
                }
              ]
            },
            {
              "ChannelFrequency": 265250000,
              "ChannelId": "09b4b5c6-5be7-4381-ad49-a82b00dc2518",
              "ChannelNumber": 31,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.23046875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.7734375
                }
              ]
            },
            {
              "ChannelFrequency": 271250000,
              "ChannelId": "d963b1c7-ac35-43a7-94b6-a82b00dc2518",
              "ChannelNumber": 32,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.0078125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.02734375
                }
              ]
            },
            {
              "ChannelFrequency": 277250000,
              "ChannelId": "6a83b9ac-3e4e-4b42-9512-a82b00dc2518",
              "ChannelNumber": 33,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.95703125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.12890625
                }
              ]
            },
            {
              "ChannelFrequency": 283250000,
              "ChannelId": "6daa4930-ef3d-410a-91cd-a82b00dc2518",
              "ChannelNumber": 34,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.59765625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.87890625
                }
              ]
            },
            {
              "ChannelFrequency": 289250000,
              "ChannelId": "4a9d5f51-4f23-40d2-8b5e-a82b00dc2518",
              "ChannelNumber": 35,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.40625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.58984375
                }
              ]
            },
            {
              "ChannelFrequency": 295250000,
              "ChannelId": "1c3be5b5-6d5e-49e2-bdc4-a82b00dc2518",
              "ChannelNumber": 36,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.68359375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.1640625
                }
              ]
            },
            {
              "ChannelFrequency": 301250000,
              "ChannelId": "b180a7de-8a15-45af-8459-a82b00dc2518",
              "ChannelNumber": 37,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.84375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.32421875
                }
              ]
            },
            {
              "ChannelFrequency": 307250000,
              "ChannelId": "6f7853f8-9493-4a9f-9554-a82b00dc2518",
              "ChannelNumber": 38,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.4921875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.3671875
                }
              ]
            },
            {
              "ChannelFrequency": 313250000,
              "ChannelId": "1a2c7a39-5a2e-4d23-aa6b-a82b00dc2518",
              "ChannelNumber": 39,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.6875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.39453125
                }
              ]
            },
            {
              "ChannelFrequency": 319250000,
              "ChannelId": "719c13d7-7fb8-484f-91d1-a82b00dc2518",
              "ChannelNumber": 40,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.33984375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.48828125
                }
              ]
            },
            {
              "ChannelFrequency": 325250000,
              "ChannelId": "148cc6df-9487-4a71-84af-a82b00dc2518",
              "ChannelNumber": 41,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.98046875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.1640625
                }
              ]
            },
            {
              "ChannelFrequency": 331250000,
              "ChannelId": "0df2a487-6541-4299-9b95-a82b00dc2518",
              "ChannelNumber": 42,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.98046875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.625
                }
              ]
            },
            {
              "ChannelFrequency": 337250000,
              "ChannelId": "5cdb9c98-6382-4fa4-94c9-a82b00dc2518",
              "ChannelNumber": 43,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.73828125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.61328125
                }
              ]
            },
            {
              "ChannelFrequency": 343250000,
              "ChannelId": "a8a7725a-43b8-4fa8-9db1-a82b00dc2518",
              "ChannelNumber": 44,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.5078125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.81640625
                }
              ]
            },
            {
              "ChannelFrequency": 349250000,
              "ChannelId": "f939a00b-0375-4e26-bc37-a82b00dc2518",
              "ChannelNumber": 45,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.88671875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.359375
                }
              ]
            },
            {
              "ChannelFrequency": 355250000,
              "ChannelId": "ac05f588-6157-4960-bc9c-a82b00dc2518",
              "ChannelNumber": 46,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.94140625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.43359375
                }
              ]
            },
            {
              "ChannelFrequency": 361250000,
              "ChannelId": "248d91e6-0042-470a-b313-a82b00dc2518",
              "ChannelNumber": 47,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.015625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.64453125
                }
              ]
            },
            {
              "ChannelFrequency": 367250000,
              "ChannelId": "4a873a0e-5fed-46ba-8413-a82b00dc2518",
              "ChannelNumber": 48,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.5234375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.89453125
                }
              ]
            },
            {
              "ChannelFrequency": 373250000,
              "ChannelId": "68baa617-e9df-47b2-99c0-a82b00dc2518",
              "ChannelNumber": 49,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.1953125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.84375
                }
              ]
            },
            {
              "ChannelFrequency": 379250000,
              "ChannelId": "6b1e76c5-dc4c-467c-b2ea-a82b00dc2518",
              "ChannelNumber": 50,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.4296875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.93359375
                }
              ]
            },
            {
              "ChannelFrequency": 385250000,
              "ChannelId": "35e4847e-4389-48fd-b8fc-a82b00dc2518",
              "ChannelNumber": 51,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.15234375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.4609375
                }
              ]
            },
            {
              "ChannelFrequency": 391250000,
              "ChannelId": "80f5df37-ce52-4d86-a4a5-a82b00dc2518",
              "ChannelNumber": 52,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.7421875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.57421875
                }
              ]
            },
            {
              "ChannelFrequency": 397250000,
              "ChannelId": "8759e39d-1de7-4c77-bc17-a82b00dc2518",
              "ChannelNumber": 53,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.3515625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.48046875
                }
              ]
            },
            {
              "ChannelFrequency": 403250000,
              "ChannelId": "60312701-3daa-40fa-b70f-a82b00dc2518",
              "ChannelNumber": 54,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.92578125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.171875
                }
              ]
            },
            {
              "ChannelFrequency": 411000000,
              "ChannelId": "65d4dbb6-ee63-4c72-a14e-a82b00dc2518",
              "ChannelNumber": 55,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.55859375
                }
              ]
            },
            {
              "ChannelFrequency": 417000000,
              "ChannelId": "1dcd66c6-1355-454b-9942-a82b00dc2518",
              "ChannelNumber": 56,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.4375
                }
              ]
            },
            {
              "ChannelFrequency": 423000000,
              "ChannelId": "30fe459a-7c2d-417f-89df-a82b00dc2518",
              "ChannelNumber": 57,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.78515625
                }
              ]
            },
            {
              "ChannelFrequency": 429000000,
              "ChannelId": "9e12eb77-5aa3-4d82-b30a-a82b00dc2518",
              "ChannelNumber": 58,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.88671875
                }
              ]
            },
            {
              "ChannelFrequency": 435000000,
              "ChannelId": "207ce21e-45fb-4390-b01b-a82b00dc2518",
              "ChannelNumber": 59,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.203125
                }
              ]
            },
            {
              "ChannelFrequency": 441000000,
              "ChannelId": "3d9b6fc2-ff0d-4075-9fc6-a82b00dc2518",
              "ChannelNumber": 60,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.30859375
                }
              ]
            },
            {
              "ChannelFrequency": 447000000,
              "ChannelId": "14058581-9f14-4ca4-a2de-a82b00dc2518",
              "ChannelNumber": 61,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.125
                }
              ]
            },
            {
              "ChannelFrequency": 453000000,
              "ChannelId": "89410b45-967d-44de-b17e-a82b00dc2518",
              "ChannelNumber": 62,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.875
                }
              ]
            },
            {
              "ChannelFrequency": 459000000,
              "ChannelId": "966684e8-3248-4397-ab12-a82b00dc2518",
              "ChannelNumber": 63,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.34765625
                }
              ]
            },
            {
              "ChannelFrequency": 465000000,
              "ChannelId": "c1cdadaa-3664-41df-acd0-a82b00dc2518",
              "ChannelNumber": 64,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.125
                }
              ]
            },
            {
              "ChannelFrequency": 471000000,
              "ChannelId": "47c2294a-ba96-48c8-9619-a82b00dc2518",
              "ChannelNumber": 65,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.10546875
                }
              ]
            },
            {
              "ChannelFrequency": 477000000,
              "ChannelId": "bc592138-1ccc-43be-8475-a82b00dc2518",
              "ChannelNumber": 66,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "PreBitError",
                  "Results": {
                    "Failed": true,
                    "FailedType": "NotReady"
                  },
                  "Value": 0
                },
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.05859375
                },
                {
                  "Name": "Mer256Qam",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 19
                },
                {
                  "Name": "PostBitError",
                  "Results": {
                    "Failed": true,
                    "FailedType": "NotReady"
                  },
                  "Value": 0
                }
              ]
            },
            {
              "ChannelFrequency": 483000000,
              "ChannelId": "c041fb96-1c97-4940-8070-a82b00dc2518",
              "ChannelNumber": 67,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.0234375
                }
              ]
            },
            {
              "ChannelFrequency": 489000000,
              "ChannelId": "26b2efbe-39a5-4b5b-9b6b-a82b00dc2518",
              "ChannelNumber": 68,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.08984375
                }
              ]
            },
            {
              "ChannelFrequency": 495000000,
              "ChannelId": "554eee1a-ba40-48a4-a44c-a82b00dc2518",
              "ChannelNumber": 69,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.08203125
                }
              ]
            },
            {
              "ChannelFrequency": 501000000,
              "ChannelId": "b816010e-aa6f-4941-8fe4-a82b00dc2518",
              "ChannelNumber": 70,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.7890625
                }
              ]
            },
            {
              "ChannelFrequency": 507000000,
              "ChannelId": "6dd9d3e4-5367-4061-8c21-a82b00dc2518",
              "ChannelNumber": 71,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.33203125
                }
              ]
            },
            {
              "ChannelFrequency": 513000000,
              "ChannelId": "3bc58669-1fba-442f-9628-a82b00dc2518",
              "ChannelNumber": 72,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.15625
                }
              ]
            },
            {
              "ChannelFrequency": 519000000,
              "ChannelId": "e4f33181-7fd8-4cc9-b22f-a82b00dc2518",
              "ChannelNumber": 73,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.20703125
                }
              ]
            },
            {
              "ChannelFrequency": 525000000,
              "ChannelId": "3eb2f08d-ab0a-4a23-b3b0-a82b00dc2518",
              "ChannelNumber": 74,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.109375
                }
              ]
            },
            {
              "ChannelFrequency": 531000000,
              "ChannelId": "3243dd52-a463-4018-89c1-a82b00dc2518",
              "ChannelNumber": 75,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.03515625
                }
              ]
            },
            {
              "ChannelFrequency": 537000000,
              "ChannelId": "1821bfb3-9dc0-4e88-9ec8-a82b00dc2518",
              "ChannelNumber": 76,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.32421875
                }
              ]
            },
            {
              "ChannelFrequency": 543000000,
              "ChannelId": "f6242e92-ab58-4f46-bfe5-a82b00dc2518",
              "ChannelNumber": 77,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.28515625
                }
              ]
            },
            {
              "ChannelFrequency": 549000000,
              "ChannelId": "440811e3-3c30-4969-84c5-a82b00dc2518",
              "ChannelNumber": 78,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.1953125
                }
              ]
            },
            {
              "ChannelFrequency": 555000000,
              "ChannelId": "efdbd233-6dbd-416a-ab00-a82b00dc2518",
              "ChannelNumber": 79,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.76953125
                }
              ]
            },
            {
              "ChannelFrequency": 561000000,
              "ChannelId": "5220bac3-c0cb-43f9-9070-a82b00dc2518",
              "ChannelNumber": 80,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.92578125
                }
              ]
            },
            {
              "ChannelFrequency": 567000000,
              "ChannelId": "ab52632e-4b8e-47de-97d1-a82b00dc2518",
              "ChannelNumber": 81,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.30859375
                }
              ]
            },
            {
              "ChannelFrequency": 573000000,
              "ChannelId": "1803f9bb-91f2-4847-ac92-a82b00dc2518",
              "ChannelNumber": 82,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.30859375
                }
              ]
            },
            {
              "ChannelFrequency": 579000000,
              "ChannelId": "45869845-e128-41bc-8c26-a82b00dc2518",
              "ChannelNumber": 83,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.23828125
                }
              ]
            },
            {
              "ChannelFrequency": 585000000,
              "ChannelId": "a98a8769-3556-43c6-928c-a82b00dc2518",
              "ChannelNumber": 84,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.23828125
                }
              ]
            },
            {
              "ChannelFrequency": 591000000,
              "ChannelId": "00a5614c-7050-46ac-829c-a82b00dc2518",
              "ChannelNumber": 85,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.30078125
                }
              ]
            },
            {
              "ChannelFrequency": 597000000,
              "ChannelId": "37a99ae3-3cf2-4759-96bd-a82b00dc2518",
              "ChannelNumber": 86,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.48828125
                }
              ]
            },
            {
              "ChannelFrequency": 603000000,
              "ChannelId": "6bb9f9d1-4b0a-4c8e-a698-a82b00dc2518",
              "ChannelNumber": 87,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.40234375
                }
              ]
            },
            {
              "ChannelFrequency": 609000000,
              "ChannelId": "76620c6b-667b-45f6-9c0e-a82b00dc2518",
              "ChannelNumber": 88,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.3671875
                }
              ]
            },
            {
              "ChannelFrequency": 615000000,
              "ChannelId": "b2b19520-88d7-41e8-8443-a82b00dc2518",
              "ChannelNumber": 89,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.17578125
                }
              ]
            },
            {
              "ChannelFrequency": 621000000,
              "ChannelId": "626ee834-c97a-4d10-a06c-a82b00dc2518",
              "ChannelNumber": 90,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.2890625
                }
              ]
            },
            {
              "ChannelFrequency": 627000000,
              "ChannelId": "afac7593-c03c-4786-9563-a82b00dc2518",
              "ChannelNumber": 91,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.21484375
                }
              ]
            },
            {
              "ChannelFrequency": 633000000,
              "ChannelId": "a72813f3-3f84-42c6-8d4c-a82b00dc2518",
              "ChannelNumber": 92,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.33984375
                }
              ]
            },
            {
              "ChannelFrequency": 639000000,
              "ChannelId": "c69ddde5-7984-46d4-a067-a82b00dc2518",
              "ChannelNumber": 93,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.24609375
                }
              ]
            },
            {
              "ChannelFrequency": 645000000,
              "ChannelId": "d9dba1cf-87ed-4f6a-a857-a82b00dc2518",
              "ChannelNumber": 94,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.34765625
                }
              ]
            },
            {
              "ChannelFrequency": 651000000,
              "ChannelId": "5035547f-7af4-4cbd-9a70-a82b00dc2518",
              "ChannelNumber": 100,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.08203125
                }
              ]
            },
            {
              "ChannelFrequency": 657000000,
              "ChannelId": "b7b07f9b-c031-4920-924c-a82b00dc2518",
              "ChannelNumber": 101,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.9921875
                }
              ]
            },
            {
              "ChannelFrequency": 663000000,
              "ChannelId": "1f54f63e-0853-49a2-81ad-a82b00dc2518",
              "ChannelNumber": 102,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.21484375
                }
              ]
            },
            {
              "ChannelFrequency": 669000000,
              "ChannelId": "39da3d64-992e-496d-8a7f-a82b00dc2518",
              "ChannelNumber": 103,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.3359375
                }
              ]
            },
            {
              "ChannelFrequency": 675000000,
              "ChannelId": "e7ee2ed5-2222-423a-89ee-a82b00dc2518",
              "ChannelNumber": 104,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.43359375
                }
              ]
            },
            {
              "ChannelFrequency": 681000000,
              "ChannelId": "3c051ec6-c97c-4596-830d-a82b00dc2518",
              "ChannelNumber": 105,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.5234375
                }
              ]
            },
            {
              "ChannelFrequency": 687000000,
              "ChannelId": "3977e7a5-c95c-4984-9084-a82b00dc2518",
              "ChannelNumber": 106,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.359375
                }
              ]
            },
            {
              "ChannelFrequency": 693000000,
              "ChannelId": "85ed244a-6dfa-439f-8d64-a82b00dc2518",
              "ChannelNumber": 107,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.4296875
                }
              ]
            },
            {
              "ChannelFrequency": 699000000,
              "ChannelId": "3d844490-0bc9-4afe-845a-a82b00dc2518",
              "ChannelNumber": 108,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.52734375
                }
              ]
            },
            {
              "ChannelFrequency": 705000000,
              "ChannelId": "c722eaa2-cc3a-46f7-a1c4-a82b00dc2518",
              "ChannelNumber": 109,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.48828125
                }
              ]
            },
            {
              "ChannelFrequency": 711000000,
              "ChannelId": "5e30d047-f212-43b6-8dfc-a82b00dc2518",
              "ChannelNumber": 110,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.1328125
                }
              ]
            },
            {
              "ChannelFrequency": 717000000,
              "ChannelId": "918c5315-f6f1-411a-8fc3-a82b00dc2518",
              "ChannelNumber": 111,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.16015625
                }
              ]
            },
            {
              "ChannelFrequency": 723000000,
              "ChannelId": "d92b2ea2-2788-4c1e-9c5a-a82b00dc2518",
              "ChannelNumber": 112,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.0546875
                }
              ]
            },
            {
              "ChannelFrequency": 729000000,
              "ChannelId": "f9d6bb8c-c210-4564-8ecc-a82b00dc2518",
              "ChannelNumber": 113,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.2421875
                }
              ]
            },
            {
              "ChannelFrequency": 735000000,
              "ChannelId": "ba3c4477-5523-4852-8b66-a82b00dc2518",
              "ChannelNumber": 114,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.09375
                }
              ]
            },
            {
              "ChannelFrequency": 741000000,
              "ChannelId": "93b6e0e5-55d2-4b92-a9dc-a82b00dc2518",
              "ChannelNumber": 115,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.0234375
                }
              ]
            },
            {
              "ChannelFrequency": 747000000,
              "ChannelId": "99fc6f42-c16a-485c-8fa6-a82b00dc2518",
              "ChannelNumber": 116,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.90625
                }
              ]
            },
            {
              "ChannelFrequency": 753000000,
              "ChannelId": "ddd7451d-dead-4db9-bbdc-a82b00dc2518",
              "ChannelNumber": 117,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.67578125
                }
              ]
            },
            {
              "ChannelFrequency": 759000000,
              "ChannelId": "25166896-c3d6-4ba4-95a7-a82b00dc2518",
              "ChannelNumber": 118,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.80859375
                }
              ]
            },
            {
              "ChannelFrequency": 765000000,
              "ChannelId": "94bb252b-2683-40d8-bd5f-a82b00dc2518",
              "ChannelNumber": 119,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.92578125
                }
              ]
            },
            {
              "ChannelFrequency": 771000000,
              "ChannelId": "bcdd310d-d98b-4c73-b8d3-a82b00dc2518",
              "ChannelNumber": 120,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.9921875
                }
              ]
            },
            {
              "ChannelFrequency": 777000000,
              "ChannelId": "00401c95-477f-4add-8fb2-a82b00dc2518",
              "ChannelNumber": 121,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.8203125
                }
              ]
            },
            {
              "ChannelFrequency": 783000000,
              "ChannelId": "c63bc250-070b-425d-b842-a82b00dc2518",
              "ChannelNumber": 122,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.515625
                }
              ]
            },
            {
              "ChannelFrequency": 789000000,
              "ChannelId": "bfa83b1b-862e-48aa-b8e3-a82b00dc2518",
              "ChannelNumber": 123,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.67578125
                }
              ]
            },
            {
              "ChannelFrequency": 795000000,
              "ChannelId": "fffad770-10b5-4cb3-8312-a82b00dc2518",
              "ChannelNumber": 124,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.91796875
                }
              ]
            },
            {
              "ChannelFrequency": 801000000,
              "ChannelId": "5a27cb82-0682-4214-97c1-a82b00dc2518",
              "ChannelNumber": 125,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.05078125
                }
              ]
            },
            {
              "ChannelFrequency": 807000000,
              "ChannelId": "cc62d19a-bf95-4d13-9f40-a82b00dc2518",
              "ChannelNumber": 126,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.1171875
                }
              ]
            },
            {
              "ChannelFrequency": 813000000,
              "ChannelId": "1da233b4-2b95-4907-97a8-a82b00dc2518",
              "ChannelNumber": 127,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.10546875
                }
              ]
            },
            {
              "ChannelFrequency": 819000000,
              "ChannelId": "39cadf21-9655-4b00-ae76-a82b00dc2518",
              "ChannelNumber": 128,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.16796875
                }
              ]
            },
            {
              "ChannelFrequency": 825000000,
              "ChannelId": "434d6e82-48b9-4cb6-88bc-a82b00dc2518",
              "ChannelNumber": 129,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.140625
                }
              ]
            },
            {
              "ChannelFrequency": 831000000,
              "ChannelId": "82156c99-120d-4441-8eb1-a82b00dc2518",
              "ChannelNumber": 130,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.6171875
                }
              ]
            },
            {
              "ChannelFrequency": 837000000,
              "ChannelId": "d32a91d8-9ac4-4ee7-bf5f-a82b00dc2518",
              "ChannelNumber": 131,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.296875
                }
              ]
            },
            {
              "ChannelFrequency": 843000000,
              "ChannelId": "46184a62-acbc-4e36-92fb-a82b00dc2518",
              "ChannelNumber": 132,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.17578125
                }
              ]
            },
            {
              "ChannelFrequency": 849000000,
              "ChannelId": "a506bda2-5ffe-43a5-b6f8-a82b00dc2518",
              "ChannelNumber": 133,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.390625
                }
              ]
            },
            {
              "ChannelFrequency": 855000000,
              "ChannelId": "2cf862af-ce52-4234-94dc-a82b00dc2518",
              "ChannelNumber": 134,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.1171875
                }
              ]
            },
            {
              "ChannelFrequency": 861000000,
              "ChannelId": "a97b78ac-6d96-4680-8047-a82b00dc2518",
              "ChannelNumber": 135,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.14453125
                }
              ]
            },
            {
              "ChannelFrequency": 867000000,
              "ChannelId": "181332d8-f335-4430-9d72-a82b00dc2518",
              "ChannelNumber": 136,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.1875
                }
              ]
            },
            {
              "ChannelFrequency": 873000000,
              "ChannelId": "be54ef2b-e540-4c73-b501-a82b00dc2518",
              "ChannelNumber": 137,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43
                }
              ]
            },
            {
              "ChannelFrequency": 879000000,
              "ChannelId": "84e49cff-182f-4a76-9b08-a82b00dc2518",
              "ChannelNumber": 138,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.671875
                }
              ]
            },
            {
              "ChannelFrequency": 885000000,
              "ChannelId": "24f39075-5781-4ff3-a5ea-a82b00dc2518",
              "ChannelNumber": 139,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.07421875
                }
              ]
            },
            {
              "ChannelFrequency": 891000000,
              "ChannelId": "c08ff91d-510b-40e9-9900-a82b00dc2518",
              "ChannelNumber": 140,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.8984375
                }
              ]
            },
            {
              "ChannelFrequency": 897000000,
              "ChannelId": "5139352c-2598-4a4b-a917-a82b00dc2518",
              "ChannelNumber": 141,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.8828125
                }
              ]
            },
            {
              "ChannelFrequency": 903000000,
              "ChannelId": "ba60a233-536c-49b2-a7a2-a82b00dc2518",
              "ChannelNumber": 142,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.6171875
                }
              ]
            },
            {
              "ChannelFrequency": 909000000,
              "ChannelId": "704be187-ce54-4e95-a1d3-a82b00dc2518",
              "ChannelNumber": 143,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.875
                }
              ]
            },
            {
              "ChannelFrequency": 915000000,
              "ChannelId": "92c0dcbd-621c-45d0-9c3f-a82b00dc2518",
              "ChannelNumber": 144,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.546875
                }
              ]
            },
            {
              "ChannelFrequency": 921000000,
              "ChannelId": "adb465b8-6395-4df9-9ab5-a82b00dc2518",
              "ChannelNumber": 145,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.4140625
                }
              ]
            },
            {
              "ChannelFrequency": 921000000,
              "ChannelId": "83f47631-9f68-4a47-a4f6-a82b00dc2518",
              "ChannelNumber": 145,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.61328125
                }
              ]
            },
            {
              "ChannelFrequency": 927000000,
              "ChannelId": "03f7285f-9c51-4fd1-b6e4-a82b00dc2518",
              "ChannelNumber": 146,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.3515625
                }
              ]
            },
            {
              "ChannelFrequency": 933000000,
              "ChannelId": "e3c72335-7695-4d6e-90a1-a82b00dc2518",
              "ChannelNumber": 147,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.671875
                }
              ]
            },
            {
              "ChannelFrequency": 939000000,
              "ChannelId": "97b2814c-4c27-4ebf-a08b-a82b00dc2518",
              "ChannelNumber": 148,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.8046875
                }
              ]
            },
            {
              "ChannelFrequency": 945000000,
              "ChannelId": "c170daf9-b5ef-41aa-99d9-a82b00dc2518",
              "ChannelNumber": 149,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.90234375
                }
              ]
            },
            {
              "ChannelFrequency": 951000000,
              "ChannelId": "cad92145-625b-430b-a554-a82b00dc2518",
              "ChannelNumber": 150,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.80078125
                }
              ]
            },
            {
              "ChannelFrequency": 957000000,
              "ChannelId": "048fe897-f3b2-47d7-bcfb-a82b00dc2518",
              "ChannelNumber": 151,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.80078125
                }
              ]
            },
            {
              "ChannelFrequency": 963000000,
              "ChannelId": "9137587a-0e08-456b-b677-a82b00dc2518",
              "ChannelNumber": 152,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.8984375
                }
              ]
            },
            {
              "ChannelFrequency": 969000000,
              "ChannelId": "6c5c6cd3-59f3-447c-aa97-a82b00dc2518",
              "ChannelNumber": 153,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.9375
                }
              ]
            },
            {
              "ChannelFrequency": 975000000,
              "ChannelId": "b34b9a78-4858-4fc4-8fb9-a82b00dc2518",
              "ChannelNumber": 154,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.90625
                }
              ]
            },
            {
              "ChannelFrequency": 981000000,
              "ChannelId": "eef728ec-587e-4b9c-b0ee-a82b00dc2518",
              "ChannelNumber": 155,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.82421875
                }
              ]
            },
            {
              "ChannelFrequency": 987000000,
              "ChannelId": "08cca688-670d-40cb-bf0e-a82b00dc2518",
              "ChannelNumber": 156,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.890625
                }
              ]
            },
            {
              "ChannelFrequency": 993000000,
              "ChannelId": "60f15dd6-5ee5-49ea-bc72-a82b00dc2518",
              "ChannelNumber": 157,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.7578125
                }
              ]
            },
            {
              "ChannelFrequency": 999000000,
              "ChannelId": "b7fdde44-8c42-46eb-a91c-a82b00dc2518",
              "ChannelNumber": 158,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.49609375
                }
              ]
            }
          ],
          "MeasurementValues": [
            {
              "Name": "VideoDigitalDelta",
              "Results": {
                "Failed": false
              },
              "Value": -10.64453125
            },
            {
              "Name": "AdjacentVideoLevel",
              "Results": {
                "Failed": false
              },
              "Value": 0.90625
            },
            {
              "Name": "VideoDelta",
              "Results": {
                "Failed": false
              },
              "Value": 3.00390625
            }
          ],
          "Name": "Scan",
          "Results": {
            "Failed": true
          }
        },
        {
          "Channels": [
            {
              "CenterFrequency": 50000000,
              "IsPrimary": false,
              "IsRequested": false,
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -60
                },
                {
                  "Name": "CmDownstreamSnr",
                  "Results": null,
                  "Value": 20
                }
              ],
              "Type": "Downstream"
            },
            {
              "CenterFrequency": 5000000,
              "MeasurementValues": [
                {
                  "Name": "LaunchLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 10
                }
              ],
              "Type": "Upstream",
              "UpstreamId": 0
            }
          ],
          "Name": "Modem",
          "Results": {
            "Failed": true
          }
        }
      ],
      "UserName": "eads-us"
    },
    {
      "Attributes": {
        "MeterName": "246135-Scan-0",
        "TestPointLabel": ""
      },
      "ChannelPlanId": "e513893f-0dd7-4393-a551-9a57db3f2e08",
      "CompanyName": "VIAVI",
      "CpeMacAddress": "00:02:7C:01:D2:50",
      "Id": "705de19a-08a0-481f-a073-daab4bc846cc",
      "JobId": "de37649e-74f8-40a0-a839-dc1381b90620",
      "LimitSetId": "305c428a-9a1d-4147-a1eb-786197103fe8",
      "OpmLevel": "",
      "Results": {
        "Failed": true
      },
      "TechID": "70529",
      "TestTime": "2019-03-18T18:16:34Z",
      "TestValues": [
        {
          "Channels": [
            {
              "ChannelFrequency": 55250000,
              "ChannelId": "583593d5-364d-4245-85df-a82b00dc2518",
              "ChannelNumber": 2,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.57421875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -57.328125
                }
              ]
            },
            {
              "ChannelFrequency": 61250000,
              "ChannelId": "a90db46c-5bea-402c-8a39-a82b00dc2518",
              "ChannelNumber": 3,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.33203125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -57.10546875
                }
              ]
            },
            {
              "ChannelFrequency": 67250000,
              "ChannelId": "9d225d67-ac92-4ce9-a7ef-a82b00dc2518",
              "ChannelNumber": 4,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.43359375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.734375
                }
              ]
            },
            {
              "ChannelFrequency": 77250000,
              "ChannelId": "4d5f0ba8-5da2-4e86-8406-a82b00dc2518",
              "ChannelNumber": 5,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.796875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -57.23046875
                }
              ]
            },
            {
              "ChannelFrequency": 83250000,
              "ChannelId": "9ae9d078-87f6-4494-95a5-a82b00dc2518",
              "ChannelNumber": 6,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.69140625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -57.05078125
                }
              ]
            },
            {
              "ChannelFrequency": 91250000,
              "ChannelId": "6cc832a7-5ec3-47e0-8575-a82b00dc2518",
              "ChannelNumber": 95,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.65234375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -57.54296875
                }
              ]
            },
            {
              "ChannelFrequency": 97250000,
              "ChannelId": "0c797362-56c0-4bf7-9e21-a82b00dc2518",
              "ChannelNumber": 96,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.1484375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.6875
                }
              ]
            },
            {
              "ChannelFrequency": 103250000,
              "ChannelId": "b73acd06-42b2-4819-ac25-a82b00dc2518",
              "ChannelNumber": 97,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.95703125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -57.3515625
                }
              ]
            },
            {
              "ChannelFrequency": 109250000,
              "ChannelId": "48376af3-5910-4454-bc6a-a82b00dc2518",
              "ChannelNumber": 98,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.890625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -57
                }
              ]
            },
            {
              "ChannelFrequency": 115250000,
              "ChannelId": "7840017f-7410-44e3-8809-a82b00dc2518",
              "ChannelNumber": 99,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.6015625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -57.66015625
                }
              ]
            },
            {
              "ChannelFrequency": 121250000,
              "ChannelId": "7328146b-643d-47d7-a0df-a82b00dc2518",
              "ChannelNumber": 14,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.70703125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.5546875
                }
              ]
            },
            {
              "ChannelFrequency": 127250000,
              "ChannelId": "2bd8c53c-96f2-4688-abd5-a82b00dc2518",
              "ChannelNumber": 15,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.88671875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.4609375
                }
              ]
            },
            {
              "ChannelFrequency": 133250000,
              "ChannelId": "eb56ba34-b14c-46a6-8007-a82b00dc2518",
              "ChannelNumber": 16,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.47265625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.72265625
                }
              ]
            },
            {
              "ChannelFrequency": 139250000,
              "ChannelId": "700b9d42-4620-44af-a3b8-a82b00dc2518",
              "ChannelNumber": 17,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.578125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.44921875
                }
              ]
            },
            {
              "ChannelFrequency": 145250000,
              "ChannelId": "4e93960b-147f-4852-be8f-a82b00dc2518",
              "ChannelNumber": 18,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.26953125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.60546875
                }
              ]
            },
            {
              "ChannelFrequency": 151250000,
              "ChannelId": "2ed08a4e-44f4-4ca4-9740-a82b00dc2518",
              "ChannelNumber": 19,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.03515625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.25390625
                }
              ]
            },
            {
              "ChannelFrequency": 157250000,
              "ChannelId": "e60a2a49-c540-44d9-b332-a82b00dc2518",
              "ChannelNumber": 20,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.55859375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.3125
                }
              ]
            },
            {
              "ChannelFrequency": 163250000,
              "ChannelId": "5d6de430-6959-48ed-a7ff-a82b00dc2518",
              "ChannelNumber": 21,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.21484375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.17578125
                }
              ]
            },
            {
              "ChannelFrequency": 169250000,
              "ChannelId": "ad41f6cf-dd9a-4374-8ae5-a82b00dc2518",
              "ChannelNumber": 22,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.10546875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.12890625
                }
              ]
            },
            {
              "ChannelFrequency": 175250000,
              "ChannelId": "c4b388ee-7d9a-4e8c-8331-a82b00dc2518",
              "ChannelNumber": 7,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.9609375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.80859375
                }
              ]
            },
            {
              "ChannelFrequency": 181250000,
              "ChannelId": "e5c9cfb4-fd29-40d8-a561-a82b00dc2518",
              "ChannelNumber": 8,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.14453125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.52734375
                }
              ]
            },
            {
              "ChannelFrequency": 187250000,
              "ChannelId": "bf6abdc0-c525-4a25-8ee1-a82b00dc2518",
              "ChannelNumber": 9,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.6171875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.0078125
                }
              ]
            },
            {
              "ChannelFrequency": 193250000,
              "ChannelId": "8d2b1b19-afca-4277-a576-a82b00dc2518",
              "ChannelNumber": 10,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.6875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.09765625
                }
              ]
            },
            {
              "ChannelFrequency": 199250000,
              "ChannelId": "7a5267ce-86a5-4b0d-9e5f-a82b00dc2518",
              "ChannelNumber": 11,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.73828125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.74609375
                }
              ]
            },
            {
              "ChannelFrequency": 205250000,
              "ChannelId": "8cdcf53e-0790-48db-9570-a82b00dc2518",
              "ChannelNumber": 12,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.44140625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.0703125
                }
              ]
            },
            {
              "ChannelFrequency": 211250000,
              "ChannelId": "ceb33e08-7543-4b52-a8e0-a82b00dc2518",
              "ChannelNumber": 13,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.4140625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.31640625
                }
              ]
            },
            {
              "ChannelFrequency": 217250000,
              "ChannelId": "098825ab-1384-47b8-88c2-a82b00dc2518",
              "ChannelNumber": 23,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.30078125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.4765625
                }
              ]
            },
            {
              "ChannelFrequency": 223250000,
              "ChannelId": "7c4f4aef-0245-4cf3-915d-a82b00dc2518",
              "ChannelNumber": 24,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -0.07421875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.0859375
                }
              ]
            },
            {
              "ChannelFrequency": 229250000,
              "ChannelId": "be2ad352-60ca-41e6-ac44-a82b00dc2518",
              "ChannelNumber": 25,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.21484375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.8203125
                }
              ]
            },
            {
              "ChannelFrequency": 235250000,
              "ChannelId": "e82507c6-4de2-49e0-b450-a82b00dc2518",
              "ChannelNumber": 26,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.640625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.2421875
                }
              ]
            },
            {
              "ChannelFrequency": 241250000,
              "ChannelId": "9150b9b2-35ea-4283-81f6-a82b00dc2518",
              "ChannelNumber": 27,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.6015625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.51953125
                }
              ]
            },
            {
              "ChannelFrequency": 247250000,
              "ChannelId": "fe01359d-5920-45df-bc4c-a82b00dc2518",
              "ChannelNumber": 28,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.40234375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.046875
                }
              ]
            },
            {
              "ChannelFrequency": 253250000,
              "ChannelId": "96134df6-606b-4f76-8f9f-a82b00dc2518",
              "ChannelNumber": 29,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.4921875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.26953125
                }
              ]
            },
            {
              "ChannelFrequency": 259250000,
              "ChannelId": "71a1b2bc-ce01-478f-800f-a82b00dc2518",
              "ChannelNumber": 30,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.51171875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.13671875
                }
              ]
            },
            {
              "ChannelFrequency": 265250000,
              "ChannelId": "09b4b5c6-5be7-4381-ad49-a82b00dc2518",
              "ChannelNumber": 31,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.078125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.04296875
                }
              ]
            },
            {
              "ChannelFrequency": 271250000,
              "ChannelId": "d963b1c7-ac35-43a7-94b6-a82b00dc2518",
              "ChannelNumber": 32,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.52734375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.47265625
                }
              ]
            },
            {
              "ChannelFrequency": 277250000,
              "ChannelId": "6a83b9ac-3e4e-4b42-9512-a82b00dc2518",
              "ChannelNumber": 33,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.44921875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.66796875
                }
              ]
            },
            {
              "ChannelFrequency": 283250000,
              "ChannelId": "6daa4930-ef3d-410a-91cd-a82b00dc2518",
              "ChannelNumber": 34,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.859375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.42578125
                }
              ]
            },
            {
              "ChannelFrequency": 289250000,
              "ChannelId": "4a9d5f51-4f23-40d2-8b5e-a82b00dc2518",
              "ChannelNumber": 35,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.02734375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.9296875
                }
              ]
            },
            {
              "ChannelFrequency": 295250000,
              "ChannelId": "1c3be5b5-6d5e-49e2-bdc4-a82b00dc2518",
              "ChannelNumber": 36,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.15625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.3125
                }
              ]
            },
            {
              "ChannelFrequency": 301250000,
              "ChannelId": "b180a7de-8a15-45af-8459-a82b00dc2518",
              "ChannelNumber": 37,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.02734375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.859375
                }
              ]
            },
            {
              "ChannelFrequency": 307250000,
              "ChannelId": "6f7853f8-9493-4a9f-9554-a82b00dc2518",
              "ChannelNumber": 38,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.46484375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.29296875
                }
              ]
            },
            {
              "ChannelFrequency": 313250000,
              "ChannelId": "1a2c7a39-5a2e-4d23-aa6b-a82b00dc2518",
              "ChannelNumber": 39,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.921875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.49609375
                }
              ]
            },
            {
              "ChannelFrequency": 319250000,
              "ChannelId": "719c13d7-7fb8-484f-91d1-a82b00dc2518",
              "ChannelNumber": 40,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.453125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.48828125
                }
              ]
            },
            {
              "ChannelFrequency": 325250000,
              "ChannelId": "148cc6df-9487-4a71-84af-a82b00dc2518",
              "ChannelNumber": 41,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.265625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.3203125
                }
              ]
            },
            {
              "ChannelFrequency": 331250000,
              "ChannelId": "0df2a487-6541-4299-9b95-a82b00dc2518",
              "ChannelNumber": 42,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.74609375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.5625
                }
              ]
            },
            {
              "ChannelFrequency": 337250000,
              "ChannelId": "5cdb9c98-6382-4fa4-94c9-a82b00dc2518",
              "ChannelNumber": 43,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.75
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.39453125
                }
              ]
            },
            {
              "ChannelFrequency": 343250000,
              "ChannelId": "a8a7725a-43b8-4fa8-9db1-a82b00dc2518",
              "ChannelNumber": 44,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.1640625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.33203125
                }
              ]
            },
            {
              "ChannelFrequency": 349250000,
              "ChannelId": "f939a00b-0375-4e26-bc37-a82b00dc2518",
              "ChannelNumber": 45,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.98828125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.453125
                }
              ]
            },
            {
              "ChannelFrequency": 355250000,
              "ChannelId": "ac05f588-6157-4960-bc9c-a82b00dc2518",
              "ChannelNumber": 46,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.97265625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.1796875
                }
              ]
            },
            {
              "ChannelFrequency": 361250000,
              "ChannelId": "248d91e6-0042-470a-b313-a82b00dc2518",
              "ChannelNumber": 47,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.6484375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.1875
                }
              ]
            },
            {
              "ChannelFrequency": 367250000,
              "ChannelId": "4a873a0e-5fed-46ba-8413-a82b00dc2518",
              "ChannelNumber": 48,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.05859375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.140625
                }
              ]
            },
            {
              "ChannelFrequency": 373250000,
              "ChannelId": "68baa617-e9df-47b2-99c0-a82b00dc2518",
              "ChannelNumber": 49,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.0390625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55
                }
              ]
            },
            {
              "ChannelFrequency": 379250000,
              "ChannelId": "6b1e76c5-dc4c-467c-b2ea-a82b00dc2518",
              "ChannelNumber": 50,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.6015625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.625
                }
              ]
            },
            {
              "ChannelFrequency": 385250000,
              "ChannelId": "35e4847e-4389-48fd-b8fc-a82b00dc2518",
              "ChannelNumber": 51,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.3515625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.43359375
                }
              ]
            },
            {
              "ChannelFrequency": 391250000,
              "ChannelId": "80f5df37-ce52-4d86-a4a5-a82b00dc2518",
              "ChannelNumber": 52,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.3671875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.79296875
                }
              ]
            },
            {
              "ChannelFrequency": 397250000,
              "ChannelId": "8759e39d-1de7-4c77-bc17-a82b00dc2518",
              "ChannelNumber": 53,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.2578125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -53.96484375
                }
              ]
            },
            {
              "ChannelFrequency": 403250000,
              "ChannelId": "60312701-3daa-40fa-b70f-a82b00dc2518",
              "ChannelNumber": 54,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.3125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.11328125
                }
              ]
            },
            {
              "ChannelFrequency": 411000000,
              "ChannelId": "65d4dbb6-ee63-4c72-a14e-a82b00dc2518",
              "ChannelNumber": 55,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.6484375
                }
              ]
            },
            {
              "ChannelFrequency": 417000000,
              "ChannelId": "1dcd66c6-1355-454b-9942-a82b00dc2518",
              "ChannelNumber": 56,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.52734375
                }
              ]
            },
            {
              "ChannelFrequency": 423000000,
              "ChannelId": "30fe459a-7c2d-417f-89df-a82b00dc2518",
              "ChannelNumber": 57,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.83984375
                }
              ]
            },
            {
              "ChannelFrequency": 429000000,
              "ChannelId": "9e12eb77-5aa3-4d82-b30a-a82b00dc2518",
              "ChannelNumber": 58,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.14453125
                }
              ]
            },
            {
              "ChannelFrequency": 435000000,
              "ChannelId": "207ce21e-45fb-4390-b01b-a82b00dc2518",
              "ChannelNumber": 59,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.22265625
                }
              ]
            },
            {
              "ChannelFrequency": 441000000,
              "ChannelId": "3d9b6fc2-ff0d-4075-9fc6-a82b00dc2518",
              "ChannelNumber": 60,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.3828125
                }
              ]
            },
            {
              "ChannelFrequency": 447000000,
              "ChannelId": "14058581-9f14-4ca4-a2de-a82b00dc2518",
              "ChannelNumber": 61,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.1796875
                }
              ]
            },
            {
              "ChannelFrequency": 453000000,
              "ChannelId": "89410b45-967d-44de-b17e-a82b00dc2518",
              "ChannelNumber": 62,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.8125
                }
              ]
            },
            {
              "ChannelFrequency": 459000000,
              "ChannelId": "966684e8-3248-4397-ab12-a82b00dc2518",
              "ChannelNumber": 63,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.20703125
                }
              ]
            },
            {
              "ChannelFrequency": 465000000,
              "ChannelId": "c1cdadaa-3664-41df-acd0-a82b00dc2518",
              "ChannelNumber": 64,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.1484375
                }
              ]
            },
            {
              "ChannelFrequency": 471000000,
              "ChannelId": "47c2294a-ba96-48c8-9619-a82b00dc2518",
              "ChannelNumber": 65,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.03125
                }
              ]
            },
            {
              "ChannelFrequency": 477000000,
              "ChannelId": "bc592138-1ccc-43be-8475-a82b00dc2518",
              "ChannelNumber": 66,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.81640625
                }
              ]
            },
            {
              "ChannelFrequency": 483000000,
              "ChannelId": "c041fb96-1c97-4940-8070-a82b00dc2518",
              "ChannelNumber": 67,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.8828125
                }
              ]
            },
            {
              "ChannelFrequency": 489000000,
              "ChannelId": "26b2efbe-39a5-4b5b-9b6b-a82b00dc2518",
              "ChannelNumber": 68,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.109375
                }
              ]
            },
            {
              "ChannelFrequency": 495000000,
              "ChannelId": "554eee1a-ba40-48a4-a44c-a82b00dc2518",
              "ChannelNumber": 69,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.13671875
                }
              ]
            },
            {
              "ChannelFrequency": 501000000,
              "ChannelId": "b816010e-aa6f-4941-8fe4-a82b00dc2518",
              "ChannelNumber": 70,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.09765625
                }
              ]
            },
            {
              "ChannelFrequency": 507000000,
              "ChannelId": "6dd9d3e4-5367-4061-8c21-a82b00dc2518",
              "ChannelNumber": 71,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.28125
                }
              ]
            },
            {
              "ChannelFrequency": 513000000,
              "ChannelId": "3bc58669-1fba-442f-9628-a82b00dc2518",
              "ChannelNumber": 72,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.27734375
                }
              ]
            },
            {
              "ChannelFrequency": 519000000,
              "ChannelId": "e4f33181-7fd8-4cc9-b22f-a82b00dc2518",
              "ChannelNumber": 73,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.3984375
                }
              ]
            },
            {
              "ChannelFrequency": 525000000,
              "ChannelId": "3eb2f08d-ab0a-4a23-b3b0-a82b00dc2518",
              "ChannelNumber": 74,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.23046875
                }
              ]
            },
            {
              "ChannelFrequency": 531000000,
              "ChannelId": "3243dd52-a463-4018-89c1-a82b00dc2518",
              "ChannelNumber": 75,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.15625
                }
              ]
            },
            {
              "ChannelFrequency": 537000000,
              "ChannelId": "1821bfb3-9dc0-4e88-9ec8-a82b00dc2518",
              "ChannelNumber": 76,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.29296875
                }
              ]
            },
            {
              "ChannelFrequency": 543000000,
              "ChannelId": "f6242e92-ab58-4f46-bfe5-a82b00dc2518",
              "ChannelNumber": 77,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.15625
                }
              ]
            },
            {
              "ChannelFrequency": 549000000,
              "ChannelId": "440811e3-3c30-4969-84c5-a82b00dc2518",
              "ChannelNumber": 78,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.25
                }
              ]
            },
            {
              "ChannelFrequency": 555000000,
              "ChannelId": "efdbd233-6dbd-416a-ab00-a82b00dc2518",
              "ChannelNumber": 79,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.79296875
                }
              ]
            },
            {
              "ChannelFrequency": 561000000,
              "ChannelId": "5220bac3-c0cb-43f9-9070-a82b00dc2518",
              "ChannelNumber": 80,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.98046875
                }
              ]
            },
            {
              "ChannelFrequency": 567000000,
              "ChannelId": "ab52632e-4b8e-47de-97d1-a82b00dc2518",
              "ChannelNumber": 81,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.36328125
                }
              ]
            },
            {
              "ChannelFrequency": 573000000,
              "ChannelId": "1803f9bb-91f2-4847-ac92-a82b00dc2518",
              "ChannelNumber": 82,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.37890625
                }
              ]
            },
            {
              "ChannelFrequency": 579000000,
              "ChannelId": "45869845-e128-41bc-8c26-a82b00dc2518",
              "ChannelNumber": 83,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.4296875
                }
              ]
            },
            {
              "ChannelFrequency": 585000000,
              "ChannelId": "a98a8769-3556-43c6-928c-a82b00dc2518",
              "ChannelNumber": 84,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.35546875
                }
              ]
            },
            {
              "ChannelFrequency": 591000000,
              "ChannelId": "00a5614c-7050-46ac-829c-a82b00dc2518",
              "ChannelNumber": 85,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.32421875
                }
              ]
            },
            {
              "ChannelFrequency": 597000000,
              "ChannelId": "37a99ae3-3cf2-4759-96bd-a82b00dc2518",
              "ChannelNumber": 86,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.4921875
                }
              ]
            },
            {
              "ChannelFrequency": 603000000,
              "ChannelId": "6bb9f9d1-4b0a-4c8e-a698-a82b00dc2518",
              "ChannelNumber": 87,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.390625
                }
              ]
            },
            {
              "ChannelFrequency": 609000000,
              "ChannelId": "76620c6b-667b-45f6-9c0e-a82b00dc2518",
              "ChannelNumber": 88,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.4921875
                }
              ]
            },
            {
              "ChannelFrequency": 615000000,
              "ChannelId": "b2b19520-88d7-41e8-8443-a82b00dc2518",
              "ChannelNumber": 89,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.44921875
                }
              ]
            },
            {
              "ChannelFrequency": 621000000,
              "ChannelId": "626ee834-c97a-4d10-a06c-a82b00dc2518",
              "ChannelNumber": 90,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.34375
                }
              ]
            },
            {
              "ChannelFrequency": 627000000,
              "ChannelId": "afac7593-c03c-4786-9563-a82b00dc2518",
              "ChannelNumber": 91,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.26953125
                }
              ]
            },
            {
              "ChannelFrequency": 633000000,
              "ChannelId": "a72813f3-3f84-42c6-8d4c-a82b00dc2518",
              "ChannelNumber": 92,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.2734375
                }
              ]
            },
            {
              "ChannelFrequency": 639000000,
              "ChannelId": "c69ddde5-7984-46d4-a067-a82b00dc2518",
              "ChannelNumber": 93,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.30078125
                }
              ]
            },
            {
              "ChannelFrequency": 645000000,
              "ChannelId": "d9dba1cf-87ed-4f6a-a857-a82b00dc2518",
              "ChannelNumber": 94,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.33203125
                }
              ]
            },
            {
              "ChannelFrequency": 651000000,
              "ChannelId": "5035547f-7af4-4cbd-9a70-a82b00dc2518",
              "ChannelNumber": 100,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.171875
                }
              ]
            },
            {
              "ChannelFrequency": 657000000,
              "ChannelId": "b7b07f9b-c031-4920-924c-a82b00dc2518",
              "ChannelNumber": 101,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.015625
                }
              ]
            },
            {
              "ChannelFrequency": 663000000,
              "ChannelId": "1f54f63e-0853-49a2-81ad-a82b00dc2518",
              "ChannelNumber": 102,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.26953125
                }
              ]
            },
            {
              "ChannelFrequency": 669000000,
              "ChannelId": "39da3d64-992e-496d-8a7f-a82b00dc2518",
              "ChannelNumber": 103,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.32421875
                }
              ]
            },
            {
              "ChannelFrequency": 675000000,
              "ChannelId": "e7ee2ed5-2222-423a-89ee-a82b00dc2518",
              "ChannelNumber": 104,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.48828125
                }
              ]
            },
            {
              "ChannelFrequency": 681000000,
              "ChannelId": "3c051ec6-c97c-4596-830d-a82b00dc2518",
              "ChannelNumber": 105,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.6796875
                }
              ]
            },
            {
              "ChannelFrequency": 687000000,
              "ChannelId": "3977e7a5-c95c-4984-9084-a82b00dc2518",
              "ChannelNumber": 106,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.44921875
                }
              ]
            },
            {
              "ChannelFrequency": 693000000,
              "ChannelId": "85ed244a-6dfa-439f-8d64-a82b00dc2518",
              "ChannelNumber": 107,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.38671875
                }
              ]
            },
            {
              "ChannelFrequency": 699000000,
              "ChannelId": "3d844490-0bc9-4afe-845a-a82b00dc2518",
              "ChannelNumber": 108,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.58203125
                }
              ]
            },
            {
              "ChannelFrequency": 705000000,
              "ChannelId": "c722eaa2-cc3a-46f7-a1c4-a82b00dc2518",
              "ChannelNumber": 109,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.609375
                }
              ]
            },
            {
              "ChannelFrequency": 711000000,
              "ChannelId": "5e30d047-f212-43b6-8dfc-a82b00dc2518",
              "ChannelNumber": 110,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.37890625
                }
              ]
            },
            {
              "ChannelFrequency": 717000000,
              "ChannelId": "918c5315-f6f1-411a-8fc3-a82b00dc2518",
              "ChannelNumber": 111,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.1796875
                }
              ]
            },
            {
              "ChannelFrequency": 723000000,
              "ChannelId": "d92b2ea2-2788-4c1e-9c5a-a82b00dc2518",
              "ChannelNumber": 112,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.20703125
                }
              ]
            },
            {
              "ChannelFrequency": 729000000,
              "ChannelId": "f9d6bb8c-c210-4564-8ecc-a82b00dc2518",
              "ChannelNumber": 113,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.3671875
                }
              ]
            },
            {
              "ChannelFrequency": 735000000,
              "ChannelId": "ba3c4477-5523-4852-8b66-a82b00dc2518",
              "ChannelNumber": 114,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.05078125
                }
              ]
            },
            {
              "ChannelFrequency": 741000000,
              "ChannelId": "93b6e0e5-55d2-4b92-a9dc-a82b00dc2518",
              "ChannelNumber": 115,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.9140625
                }
              ]
            },
            {
              "ChannelFrequency": 747000000,
              "ChannelId": "99fc6f42-c16a-485c-8fa6-a82b00dc2518",
              "ChannelNumber": 116,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.83203125
                }
              ]
            },
            {
              "ChannelFrequency": 753000000,
              "ChannelId": "ddd7451d-dead-4db9-bbdc-a82b00dc2518",
              "ChannelNumber": 117,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.69921875
                }
              ]
            },
            {
              "ChannelFrequency": 759000000,
              "ChannelId": "25166896-c3d6-4ba4-95a7-a82b00dc2518",
              "ChannelNumber": 118,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.8984375
                }
              ]
            },
            {
              "ChannelFrequency": 765000000,
              "ChannelId": "94bb252b-2683-40d8-bd5f-a82b00dc2518",
              "ChannelNumber": 119,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.94921875
                }
              ]
            },
            {
              "ChannelFrequency": 771000000,
              "ChannelId": "bcdd310d-d98b-4c73-b8d3-a82b00dc2518",
              "ChannelNumber": 120,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.84765625
                }
              ]
            },
            {
              "ChannelFrequency": 777000000,
              "ChannelId": "00401c95-477f-4add-8fb2-a82b00dc2518",
              "ChannelNumber": 121,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.875
                }
              ]
            },
            {
              "ChannelFrequency": 783000000,
              "ChannelId": "c63bc250-070b-425d-b842-a82b00dc2518",
              "ChannelNumber": 122,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.6328125
                }
              ]
            },
            {
              "ChannelFrequency": 789000000,
              "ChannelId": "bfa83b1b-862e-48aa-b8e3-a82b00dc2518",
              "ChannelNumber": 123,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.79296875
                }
              ]
            },
            {
              "ChannelFrequency": 795000000,
              "ChannelId": "fffad770-10b5-4cb3-8312-a82b00dc2518",
              "ChannelNumber": 124,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.00390625
                }
              ]
            },
            {
              "ChannelFrequency": 801000000,
              "ChannelId": "5a27cb82-0682-4214-97c1-a82b00dc2518",
              "ChannelNumber": 125,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.04296875
                }
              ]
            },
            {
              "ChannelFrequency": 807000000,
              "ChannelId": "cc62d19a-bf95-4d13-9f40-a82b00dc2518",
              "ChannelNumber": 126,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.20703125
                }
              ]
            },
            {
              "ChannelFrequency": 813000000,
              "ChannelId": "1da233b4-2b95-4907-97a8-a82b00dc2518",
              "ChannelNumber": 127,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.23046875
                }
              ]
            },
            {
              "ChannelFrequency": 819000000,
              "ChannelId": "39cadf21-9655-4b00-ae76-a82b00dc2518",
              "ChannelNumber": 128,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.1875
                }
              ]
            },
            {
              "ChannelFrequency": 825000000,
              "ChannelId": "434d6e82-48b9-4cb6-88bc-a82b00dc2518",
              "ChannelNumber": 129,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.4375
                }
              ]
            },
            {
              "ChannelFrequency": 831000000,
              "ChannelId": "82156c99-120d-4441-8eb1-a82b00dc2518",
              "ChannelNumber": 130,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.3046875
                }
              ]
            },
            {
              "ChannelFrequency": 837000000,
              "ChannelId": "d32a91d8-9ac4-4ee7-bf5f-a82b00dc2518",
              "ChannelNumber": 131,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.37109375
                }
              ]
            },
            {
              "ChannelFrequency": 843000000,
              "ChannelId": "46184a62-acbc-4e36-92fb-a82b00dc2518",
              "ChannelNumber": 132,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.3359375
                }
              ]
            },
            {
              "ChannelFrequency": 849000000,
              "ChannelId": "a506bda2-5ffe-43a5-b6f8-a82b00dc2518",
              "ChannelNumber": 133,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.46484375
                }
              ]
            },
            {
              "ChannelFrequency": 855000000,
              "ChannelId": "2cf862af-ce52-4234-94dc-a82b00dc2518",
              "ChannelNumber": 134,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.2578125
                }
              ]
            },
            {
              "ChannelFrequency": 861000000,
              "ChannelId": "a97b78ac-6d96-4680-8047-a82b00dc2518",
              "ChannelNumber": 135,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.40625
                }
              ]
            },
            {
              "ChannelFrequency": 867000000,
              "ChannelId": "181332d8-f335-4430-9d72-a82b00dc2518",
              "ChannelNumber": 136,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.22265625
                }
              ]
            },
            {
              "ChannelFrequency": 873000000,
              "ChannelId": "be54ef2b-e540-4c73-b501-a82b00dc2518",
              "ChannelNumber": 137,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.98828125
                }
              ]
            },
            {
              "ChannelFrequency": 879000000,
              "ChannelId": "84e49cff-182f-4a76-9b08-a82b00dc2518",
              "ChannelNumber": 138,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.69140625
                }
              ]
            },
            {
              "ChannelFrequency": 885000000,
              "ChannelId": "24f39075-5781-4ff3-a5ea-a82b00dc2518",
              "ChannelNumber": 139,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.8828125
                }
              ]
            },
            {
              "ChannelFrequency": 891000000,
              "ChannelId": "c08ff91d-510b-40e9-9900-a82b00dc2518",
              "ChannelNumber": 140,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.91796875
                }
              ]
            },
            {
              "ChannelFrequency": 897000000,
              "ChannelId": "5139352c-2598-4a4b-a917-a82b00dc2518",
              "ChannelNumber": 141,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.91796875
                }
              ]
            },
            {
              "ChannelFrequency": 903000000,
              "ChannelId": "ba60a233-536c-49b2-a7a2-a82b00dc2518",
              "ChannelNumber": 142,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.73828125
                }
              ]
            },
            {
              "ChannelFrequency": 909000000,
              "ChannelId": "704be187-ce54-4e95-a1d3-a82b00dc2518",
              "ChannelNumber": 143,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.94921875
                }
              ]
            },
            {
              "ChannelFrequency": 915000000,
              "ChannelId": "92c0dcbd-621c-45d0-9c3f-a82b00dc2518",
              "ChannelNumber": 144,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.7421875
                }
              ]
            },
            {
              "ChannelFrequency": 921000000,
              "ChannelId": "adb465b8-6395-4df9-9ab5-a82b00dc2518",
              "ChannelNumber": 145,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.6328125
                }
              ]
            },
            {
              "ChannelFrequency": 921000000,
              "ChannelId": "83f47631-9f68-4a47-a4f6-a82b00dc2518",
              "ChannelNumber": 145,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.89453125
                }
              ]
            },
            {
              "ChannelFrequency": 927000000,
              "ChannelId": "03f7285f-9c51-4fd1-b6e4-a82b00dc2518",
              "ChannelNumber": 146,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.6953125
                }
              ]
            },
            {
              "ChannelFrequency": 933000000,
              "ChannelId": "e3c72335-7695-4d6e-90a1-a82b00dc2518",
              "ChannelNumber": 147,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.7265625
                }
              ]
            },
            {
              "ChannelFrequency": 939000000,
              "ChannelId": "97b2814c-4c27-4ebf-a08b-a82b00dc2518",
              "ChannelNumber": 148,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.6640625
                }
              ]
            },
            {
              "ChannelFrequency": 945000000,
              "ChannelId": "c170daf9-b5ef-41aa-99d9-a82b00dc2518",
              "ChannelNumber": 149,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.95703125
                }
              ]
            },
            {
              "ChannelFrequency": 951000000,
              "ChannelId": "cad92145-625b-430b-a554-a82b00dc2518",
              "ChannelNumber": 150,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.7578125
                }
              ]
            },
            {
              "ChannelFrequency": 957000000,
              "ChannelId": "048fe897-f3b2-47d7-bcfb-a82b00dc2518",
              "ChannelNumber": 151,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.953125
                }
              ]
            },
            {
              "ChannelFrequency": 963000000,
              "ChannelId": "9137587a-0e08-456b-b677-a82b00dc2518",
              "ChannelNumber": 152,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.82421875
                }
              ]
            },
            {
              "ChannelFrequency": 969000000,
              "ChannelId": "6c5c6cd3-59f3-447c-aa97-a82b00dc2518",
              "ChannelNumber": 153,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.0234375
                }
              ]
            },
            {
              "ChannelFrequency": 975000000,
              "ChannelId": "b34b9a78-4858-4fc4-8fb9-a82b00dc2518",
              "ChannelNumber": 154,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.89453125
                }
              ]
            },
            {
              "ChannelFrequency": 981000000,
              "ChannelId": "eef728ec-587e-4b9c-b0ee-a82b00dc2518",
              "ChannelNumber": 155,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.91015625
                }
              ]
            },
            {
              "ChannelFrequency": 987000000,
              "ChannelId": "08cca688-670d-40cb-bf0e-a82b00dc2518",
              "ChannelNumber": 156,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.87890625
                }
              ]
            },
            {
              "ChannelFrequency": 993000000,
              "ChannelId": "60f15dd6-5ee5-49ea-bc72-a82b00dc2518",
              "ChannelNumber": 157,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.78125
                }
              ]
            },
            {
              "ChannelFrequency": 999000000,
              "ChannelId": "b7fdde44-8c42-46eb-a91c-a82b00dc2518",
              "ChannelNumber": 158,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.61328125
                }
              ]
            }
          ],
          "MeasurementValues": [
            {
              "Name": "VideoDigitalDelta",
              "Results": {
                "Failed": false
              },
              "Value": -10.28515625
            },
            {
              "Name": "TiltLevel",
              "Results": null,
              "Value": 0.09765625
            },
            {
              "Name": "AdjacentVideoLevel",
              "Results": {
                "Failed": false
              },
              "Value": 1.10546875
            },
            {
              "Name": "VideoDelta",
              "Results": {
                "Failed": false
              },
              "Value": 3.6953125
            }
          ],
          "Name": "Scan",
          "Results": {
            "Failed": true
          }
        }
      ],
      "UserName": "eads-us"
    },
    {
      "Attributes": {
        "MenuName": "Scan",
        "MeterName": "123456-screen-5",
        "TechId": "70529"
      },
      "AutotestId": null,
      "BlobId": "9b2988ec-29e9-4d2f-8f1a-499632c76815",
      "BlobType": "image/png",
      "ChannelPlanId": null,
      "CpeMacAddress": "00:02:7C:01:D2:50",
      "Id": "7e960a97-2a04-4a44-8304-451ab82d30c7",
      "JobId": "db4f94e6-a7b1-4386-8a1a-777d5d271af8",
      "LimitSetId": null,
      "MeterId": null,
      "ModTime": null,
      "ModUserName": null,
      "Name": null,
      "OrganizationalNodeId": null,
      "ProcessTime": null,
      "ReadOnly": false,
      "Results": null,
      "SyncTime": "",
      "TestLocation": null,
      "TestLocationIndex": 0,
      "TestTime": "2019-03-18T17:18:00Z",
      "TestValues": [
        {
          "Attributes": null,
          "Channels": null,
          "Constellation": null,
          "MeasurementValues": null,
          "Measurements": null,
          "Name": "ScreenShot",
          "Spectrum": null
        }
      ],
      "UserName": "eads-us"
    },
    {
      "Attributes": {
        "MeterName": "123456-Scan-4",
        "TestPointLabel": ""
      },
      "ChannelPlanId": "e513893f-0dd7-4393-a551-9a57db3f2e08",
      "CompanyName": "VIAVI",
      "CpeMacAddress": "00:02:7C:01:D2:50",
      "Id": "b117792d-daa4-4828-86ea-f5fac03034de",
      "JobId": "db4f94e6-a7b1-4386-8a1a-777d5d271af8",
      "LimitSetId": "305c428a-9a1d-4147-a1eb-786197103fe8",
      "OpmLevel": "",
      "Results": {
        "Failed": true
      },
      "TechID": "70529",
      "TestTime": "2019-03-18T17:17:25Z",
      "TestValues": [
        {
          "Channels": [
            {
              "ChannelFrequency": 55250000,
              "ChannelId": "583593d5-364d-4245-85df-a82b00dc2518",
              "ChannelNumber": 2,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.31640625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.98046875
                }
              ]
            },
            {
              "ChannelFrequency": 61250000,
              "ChannelId": "a90db46c-5bea-402c-8a39-a82b00dc2518",
              "ChannelNumber": 3,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.4375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.6796875
                }
              ]
            },
            {
              "ChannelFrequency": 67250000,
              "ChannelId": "9d225d67-ac92-4ce9-a7ef-a82b00dc2518",
              "ChannelNumber": 4,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.7265625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.578125
                }
              ]
            },
            {
              "ChannelFrequency": 77250000,
              "ChannelId": "4d5f0ba8-5da2-4e86-8406-a82b00dc2518",
              "ChannelNumber": 5,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.296875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -57.10546875
                }
              ]
            },
            {
              "ChannelFrequency": 83250000,
              "ChannelId": "9ae9d078-87f6-4494-95a5-a82b00dc2518",
              "ChannelNumber": 6,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.3046875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.84765625
                }
              ]
            },
            {
              "ChannelFrequency": 91250000,
              "ChannelId": "6cc832a7-5ec3-47e0-8575-a82b00dc2518",
              "ChannelNumber": 95,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.578125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.95703125
                }
              ]
            },
            {
              "ChannelFrequency": 97250000,
              "ChannelId": "0c797362-56c0-4bf7-9e21-a82b00dc2518",
              "ChannelNumber": 96,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.5703125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.82421875
                }
              ]
            },
            {
              "ChannelFrequency": 103250000,
              "ChannelId": "b73acd06-42b2-4819-ac25-a82b00dc2518",
              "ChannelNumber": 97,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.8046875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.67578125
                }
              ]
            },
            {
              "ChannelFrequency": 109250000,
              "ChannelId": "48376af3-5910-4454-bc6a-a82b00dc2518",
              "ChannelNumber": 98,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.1328125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -57.0546875
                }
              ]
            },
            {
              "ChannelFrequency": 115250000,
              "ChannelId": "7840017f-7410-44e3-8809-a82b00dc2518",
              "ChannelNumber": 99,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.50390625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.65234375
                }
              ]
            },
            {
              "ChannelFrequency": 121250000,
              "ChannelId": "7328146b-643d-47d7-a0df-a82b00dc2518",
              "ChannelNumber": 14,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.3359375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.9921875
                }
              ]
            },
            {
              "ChannelFrequency": 127250000,
              "ChannelId": "2bd8c53c-96f2-4688-abd5-a82b00dc2518",
              "ChannelNumber": 15,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -0.19140625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -57.203125
                }
              ]
            },
            {
              "ChannelFrequency": 133250000,
              "ChannelId": "eb56ba34-b14c-46a6-8007-a82b00dc2518",
              "ChannelNumber": 16,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.91015625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.1015625
                }
              ]
            },
            {
              "ChannelFrequency": 139250000,
              "ChannelId": "700b9d42-4620-44af-a3b8-a82b00dc2518",
              "ChannelNumber": 17,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.640625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.90625
                }
              ]
            },
            {
              "ChannelFrequency": 145250000,
              "ChannelId": "4e93960b-147f-4852-be8f-a82b00dc2518",
              "ChannelNumber": 18,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.1484375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.4140625
                }
              ]
            },
            {
              "ChannelFrequency": 151250000,
              "ChannelId": "2ed08a4e-44f4-4ca4-9740-a82b00dc2518",
              "ChannelNumber": 19,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.890625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.95703125
                }
              ]
            },
            {
              "ChannelFrequency": 157250000,
              "ChannelId": "e60a2a49-c540-44d9-b332-a82b00dc2518",
              "ChannelNumber": 20,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.79296875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.54296875
                }
              ]
            },
            {
              "ChannelFrequency": 163250000,
              "ChannelId": "5d6de430-6959-48ed-a7ff-a82b00dc2518",
              "ChannelNumber": 21,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.421875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.32421875
                }
              ]
            },
            {
              "ChannelFrequency": 169250000,
              "ChannelId": "ad41f6cf-dd9a-4374-8ae5-a82b00dc2518",
              "ChannelNumber": 22,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.54296875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.66015625
                }
              ]
            },
            {
              "ChannelFrequency": 175250000,
              "ChannelId": "c4b388ee-7d9a-4e8c-8331-a82b00dc2518",
              "ChannelNumber": 7,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.05078125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.25
                }
              ]
            },
            {
              "ChannelFrequency": 181250000,
              "ChannelId": "e5c9cfb4-fd29-40d8-a561-a82b00dc2518",
              "ChannelNumber": 8,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.34375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.28125
                }
              ]
            },
            {
              "ChannelFrequency": 187250000,
              "ChannelId": "bf6abdc0-c525-4a25-8ee1-a82b00dc2518",
              "ChannelNumber": 9,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.640625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.765625
                }
              ]
            },
            {
              "ChannelFrequency": 193250000,
              "ChannelId": "8d2b1b19-afca-4277-a576-a82b00dc2518",
              "ChannelNumber": 10,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.5234375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.31640625
                }
              ]
            },
            {
              "ChannelFrequency": 199250000,
              "ChannelId": "7a5267ce-86a5-4b0d-9e5f-a82b00dc2518",
              "ChannelNumber": 11,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.32421875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.80078125
                }
              ]
            },
            {
              "ChannelFrequency": 205250000,
              "ChannelId": "8cdcf53e-0790-48db-9570-a82b00dc2518",
              "ChannelNumber": 12,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.66796875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.6171875
                }
              ]
            },
            {
              "ChannelFrequency": 211250000,
              "ChannelId": "ceb33e08-7543-4b52-a8e0-a82b00dc2518",
              "ChannelNumber": 13,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.62109375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.015625
                }
              ]
            },
            {
              "ChannelFrequency": 217250000,
              "ChannelId": "098825ab-1384-47b8-88c2-a82b00dc2518",
              "ChannelNumber": 23,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.8984375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.15625
                }
              ]
            },
            {
              "ChannelFrequency": 223250000,
              "ChannelId": "7c4f4aef-0245-4cf3-915d-a82b00dc2518",
              "ChannelNumber": 24,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.64453125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -56.359375
                }
              ]
            },
            {
              "ChannelFrequency": 229250000,
              "ChannelId": "be2ad352-60ca-41e6-ac44-a82b00dc2518",
              "ChannelNumber": 25,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.71484375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.35546875
                }
              ]
            },
            {
              "ChannelFrequency": 235250000,
              "ChannelId": "e82507c6-4de2-49e0-b450-a82b00dc2518",
              "ChannelNumber": 26,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.6640625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.35546875
                }
              ]
            },
            {
              "ChannelFrequency": 241250000,
              "ChannelId": "9150b9b2-35ea-4283-81f6-a82b00dc2518",
              "ChannelNumber": 27,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.67578125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.234375
                }
              ]
            },
            {
              "ChannelFrequency": 247250000,
              "ChannelId": "fe01359d-5920-45df-bc4c-a82b00dc2518",
              "ChannelNumber": 28,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.63671875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.4765625
                }
              ]
            },
            {
              "ChannelFrequency": 253250000,
              "ChannelId": "96134df6-606b-4f76-8f9f-a82b00dc2518",
              "ChannelNumber": 29,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.9765625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.0234375
                }
              ]
            },
            {
              "ChannelFrequency": 259250000,
              "ChannelId": "71a1b2bc-ce01-478f-800f-a82b00dc2518",
              "ChannelNumber": 30,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.65234375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.9453125
                }
              ]
            },
            {
              "ChannelFrequency": 265250000,
              "ChannelId": "09b4b5c6-5be7-4381-ad49-a82b00dc2518",
              "ChannelNumber": 31,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.48046875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.2265625
                }
              ]
            },
            {
              "ChannelFrequency": 271250000,
              "ChannelId": "d963b1c7-ac35-43a7-94b6-a82b00dc2518",
              "ChannelNumber": 32,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.6015625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.65625
                }
              ]
            },
            {
              "ChannelFrequency": 277250000,
              "ChannelId": "6a83b9ac-3e4e-4b42-9512-a82b00dc2518",
              "ChannelNumber": 33,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.265625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.8359375
                }
              ]
            },
            {
              "ChannelFrequency": 283250000,
              "ChannelId": "6daa4930-ef3d-410a-91cd-a82b00dc2518",
              "ChannelNumber": 34,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.3515625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.015625
                }
              ]
            },
            {
              "ChannelFrequency": 289250000,
              "ChannelId": "4a9d5f51-4f23-40d2-8b5e-a82b00dc2518",
              "ChannelNumber": 35,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.74609375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.2890625
                }
              ]
            },
            {
              "ChannelFrequency": 295250000,
              "ChannelId": "1c3be5b5-6d5e-49e2-bdc4-a82b00dc2518",
              "ChannelNumber": 36,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.64453125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.08984375
                }
              ]
            },
            {
              "ChannelFrequency": 301250000,
              "ChannelId": "b180a7de-8a15-45af-8459-a82b00dc2518",
              "ChannelNumber": 37,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.55078125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.7734375
                }
              ]
            },
            {
              "ChannelFrequency": 307250000,
              "ChannelId": "6f7853f8-9493-4a9f-9554-a82b00dc2518",
              "ChannelNumber": 38,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.70703125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.0390625
                }
              ]
            },
            {
              "ChannelFrequency": 313250000,
              "ChannelId": "1a2c7a39-5a2e-4d23-aa6b-a82b00dc2518",
              "ChannelNumber": 39,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.67578125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.03125
                }
              ]
            },
            {
              "ChannelFrequency": 319250000,
              "ChannelId": "719c13d7-7fb8-484f-91d1-a82b00dc2518",
              "ChannelNumber": 40,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.0625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.93359375
                }
              ]
            },
            {
              "ChannelFrequency": 325250000,
              "ChannelId": "148cc6df-9487-4a71-84af-a82b00dc2518",
              "ChannelNumber": 41,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.14453125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.12890625
                }
              ]
            },
            {
              "ChannelFrequency": 331250000,
              "ChannelId": "0df2a487-6541-4299-9b95-a82b00dc2518",
              "ChannelNumber": 42,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.40234375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.6796875
                }
              ]
            },
            {
              "ChannelFrequency": 337250000,
              "ChannelId": "5cdb9c98-6382-4fa4-94c9-a82b00dc2518",
              "ChannelNumber": 43,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.390625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.83203125
                }
              ]
            },
            {
              "ChannelFrequency": 343250000,
              "ChannelId": "a8a7725a-43b8-4fa8-9db1-a82b00dc2518",
              "ChannelNumber": 44,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.546875
                }
              ]
            },
            {
              "ChannelFrequency": 349250000,
              "ChannelId": "f939a00b-0375-4e26-bc37-a82b00dc2518",
              "ChannelNumber": 45,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.16796875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.63671875
                }
              ]
            },
            {
              "ChannelFrequency": 355250000,
              "ChannelId": "ac05f588-6157-4960-bc9c-a82b00dc2518",
              "ChannelNumber": 46,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.08984375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.390625
                }
              ]
            },
            {
              "ChannelFrequency": 361250000,
              "ChannelId": "248d91e6-0042-470a-b313-a82b00dc2518",
              "ChannelNumber": 47,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.890625
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -55.08984375
                }
              ]
            },
            {
              "ChannelFrequency": 367250000,
              "ChannelId": "4a873a0e-5fed-46ba-8413-a82b00dc2518",
              "ChannelNumber": 48,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.08203125
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.83203125
                }
              ]
            },
            {
              "ChannelFrequency": 373250000,
              "ChannelId": "68baa617-e9df-47b2-99c0-a82b00dc2518",
              "ChannelNumber": 49,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.76171875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.6328125
                }
              ]
            },
            {
              "ChannelFrequency": 379250000,
              "ChannelId": "6b1e76c5-dc4c-467c-b2ea-a82b00dc2518",
              "ChannelNumber": 50,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.1875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.53125
                }
              ]
            },
            {
              "ChannelFrequency": 385250000,
              "ChannelId": "35e4847e-4389-48fd-b8fc-a82b00dc2518",
              "ChannelNumber": 51,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.2109375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.60546875
                }
              ]
            },
            {
              "ChannelFrequency": 391250000,
              "ChannelId": "80f5df37-ce52-4d86-a4a5-a82b00dc2518",
              "ChannelNumber": 52,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 1.375
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.27734375
                }
              ]
            },
            {
              "ChannelFrequency": 397250000,
              "ChannelId": "8759e39d-1de7-4c77-bc17-a82b00dc2518",
              "ChannelNumber": 53,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.79296875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.328125
                }
              ]
            },
            {
              "ChannelFrequency": 403250000,
              "ChannelId": "60312701-3daa-40fa-b70f-a82b00dc2518",
              "ChannelNumber": 54,
              "ChannelType": "Analog",
              "MeasurementValues": [
                {
                  "Name": "VideoAudioDelta",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": 0.875
                },
                {
                  "Name": "VideoLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -54.25390625
                }
              ]
            },
            {
              "ChannelFrequency": 411000000,
              "ChannelId": "65d4dbb6-ee63-4c72-a14e-a82b00dc2518",
              "ChannelNumber": 55,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.546875
                }
              ]
            },
            {
              "ChannelFrequency": 417000000,
              "ChannelId": "1dcd66c6-1355-454b-9942-a82b00dc2518",
              "ChannelNumber": 56,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.4921875
                }
              ]
            },
            {
              "ChannelFrequency": 423000000,
              "ChannelId": "30fe459a-7c2d-417f-89df-a82b00dc2518",
              "ChannelNumber": 57,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.90625
                }
              ]
            },
            {
              "ChannelFrequency": 429000000,
              "ChannelId": "9e12eb77-5aa3-4d82-b30a-a82b00dc2518",
              "ChannelNumber": 58,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.0078125
                }
              ]
            },
            {
              "ChannelFrequency": 435000000,
              "ChannelId": "207ce21e-45fb-4390-b01b-a82b00dc2518",
              "ChannelNumber": 59,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.12109375
                }
              ]
            },
            {
              "ChannelFrequency": 441000000,
              "ChannelId": "3d9b6fc2-ff0d-4075-9fc6-a82b00dc2518",
              "ChannelNumber": 60,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.1484375
                }
              ]
            },
            {
              "ChannelFrequency": 447000000,
              "ChannelId": "14058581-9f14-4ca4-a2de-a82b00dc2518",
              "ChannelNumber": 61,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.24609375
                }
              ]
            },
            {
              "ChannelFrequency": 453000000,
              "ChannelId": "89410b45-967d-44de-b17e-a82b00dc2518",
              "ChannelNumber": 62,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.9296875
                }
              ]
            },
            {
              "ChannelFrequency": 459000000,
              "ChannelId": "966684e8-3248-4397-ab12-a82b00dc2518",
              "ChannelNumber": 63,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.11328125
                }
              ]
            },
            {
              "ChannelFrequency": 465000000,
              "ChannelId": "c1cdadaa-3664-41df-acd0-a82b00dc2518",
              "ChannelNumber": 64,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.24609375
                }
              ]
            },
            {
              "ChannelFrequency": 471000000,
              "ChannelId": "47c2294a-ba96-48c8-9619-a82b00dc2518",
              "ChannelNumber": 65,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43
                }
              ]
            },
            {
              "ChannelFrequency": 477000000,
              "ChannelId": "bc592138-1ccc-43be-8475-a82b00dc2518",
              "ChannelNumber": 66,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.87890625
                }
              ]
            },
            {
              "ChannelFrequency": 483000000,
              "ChannelId": "c041fb96-1c97-4940-8070-a82b00dc2518",
              "ChannelNumber": 67,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.9140625
                }
              ]
            },
            {
              "ChannelFrequency": 489000000,
              "ChannelId": "26b2efbe-39a5-4b5b-9b6b-a82b00dc2518",
              "ChannelNumber": 68,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.1796875
                }
              ]
            },
            {
              "ChannelFrequency": 495000000,
              "ChannelId": "554eee1a-ba40-48a4-a44c-a82b00dc2518",
              "ChannelNumber": 69,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.0390625
                }
              ]
            },
            {
              "ChannelFrequency": 501000000,
              "ChannelId": "b816010e-aa6f-4941-8fe4-a82b00dc2518",
              "ChannelNumber": 70,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.12890625
                }
              ]
            },
            {
              "ChannelFrequency": 507000000,
              "ChannelId": "6dd9d3e4-5367-4061-8c21-a82b00dc2518",
              "ChannelNumber": 71,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.33203125
                }
              ]
            },
            {
              "ChannelFrequency": 513000000,
              "ChannelId": "3bc58669-1fba-442f-9628-a82b00dc2518",
              "ChannelNumber": 72,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.34765625
                }
              ]
            },
            {
              "ChannelFrequency": 519000000,
              "ChannelId": "e4f33181-7fd8-4cc9-b22f-a82b00dc2518",
              "ChannelNumber": 73,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.36328125
                }
              ]
            },
            {
              "ChannelFrequency": 525000000,
              "ChannelId": "3eb2f08d-ab0a-4a23-b3b0-a82b00dc2518",
              "ChannelNumber": 74,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.1953125
                }
              ]
            },
            {
              "ChannelFrequency": 531000000,
              "ChannelId": "3243dd52-a463-4018-89c1-a82b00dc2518",
              "ChannelNumber": 75,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.08984375
                }
              ]
            },
            {
              "ChannelFrequency": 537000000,
              "ChannelId": "1821bfb3-9dc0-4e88-9ec8-a82b00dc2518",
              "ChannelNumber": 76,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.328125
                }
              ]
            },
            {
              "ChannelFrequency": 543000000,
              "ChannelId": "f6242e92-ab58-4f46-bfe5-a82b00dc2518",
              "ChannelNumber": 77,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.15625
                }
              ]
            },
            {
              "ChannelFrequency": 549000000,
              "ChannelId": "440811e3-3c30-4969-84c5-a82b00dc2518",
              "ChannelNumber": 78,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.1875
                }
              ]
            },
            {
              "ChannelFrequency": 555000000,
              "ChannelId": "efdbd233-6dbd-416a-ab00-a82b00dc2518",
              "ChannelNumber": 79,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.85546875
                }
              ]
            },
            {
              "ChannelFrequency": 561000000,
              "ChannelId": "5220bac3-c0cb-43f9-9070-a82b00dc2518",
              "ChannelNumber": 80,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.9140625
                }
              ]
            },
            {
              "ChannelFrequency": 567000000,
              "ChannelId": "ab52632e-4b8e-47de-97d1-a82b00dc2518",
              "ChannelNumber": 81,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.3125
                }
              ]
            },
            {
              "ChannelFrequency": 573000000,
              "ChannelId": "1803f9bb-91f2-4847-ac92-a82b00dc2518",
              "ChannelNumber": 82,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.2578125
                }
              ]
            },
            {
              "ChannelFrequency": 579000000,
              "ChannelId": "45869845-e128-41bc-8c26-a82b00dc2518",
              "ChannelNumber": 83,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.1953125
                }
              ]
            },
            {
              "ChannelFrequency": 585000000,
              "ChannelId": "a98a8769-3556-43c6-928c-a82b00dc2518",
              "ChannelNumber": 84,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.2265625
                }
              ]
            },
            {
              "ChannelFrequency": 591000000,
              "ChannelId": "00a5614c-7050-46ac-829c-a82b00dc2518",
              "ChannelNumber": 85,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.421875
                }
              ]
            },
            {
              "ChannelFrequency": 597000000,
              "ChannelId": "37a99ae3-3cf2-4759-96bd-a82b00dc2518",
              "ChannelNumber": 86,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.52734375
                }
              ]
            },
            {
              "ChannelFrequency": 603000000,
              "ChannelId": "6bb9f9d1-4b0a-4c8e-a698-a82b00dc2518",
              "ChannelNumber": 87,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.45703125
                }
              ]
            },
            {
              "ChannelFrequency": 609000000,
              "ChannelId": "76620c6b-667b-45f6-9c0e-a82b00dc2518",
              "ChannelNumber": 88,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.421875
                }
              ]
            },
            {
              "ChannelFrequency": 615000000,
              "ChannelId": "b2b19520-88d7-41e8-8443-a82b00dc2518",
              "ChannelNumber": 89,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.3984375
                }
              ]
            },
            {
              "ChannelFrequency": 621000000,
              "ChannelId": "626ee834-c97a-4d10-a06c-a82b00dc2518",
              "ChannelNumber": 90,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.171875
                }
              ]
            },
            {
              "ChannelFrequency": 627000000,
              "ChannelId": "afac7593-c03c-4786-9563-a82b00dc2518",
              "ChannelNumber": 91,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.3203125
                }
              ]
            },
            {
              "ChannelFrequency": 633000000,
              "ChannelId": "a72813f3-3f84-42c6-8d4c-a82b00dc2518",
              "ChannelNumber": 92,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.20703125
                }
              ]
            },
            {
              "ChannelFrequency": 639000000,
              "ChannelId": "c69ddde5-7984-46d4-a067-a82b00dc2518",
              "ChannelNumber": 93,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.16796875
                }
              ]
            },
            {
              "ChannelFrequency": 645000000,
              "ChannelId": "d9dba1cf-87ed-4f6a-a857-a82b00dc2518",
              "ChannelNumber": 94,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.296875
                }
              ]
            },
            {
              "ChannelFrequency": 651000000,
              "ChannelId": "5035547f-7af4-4cbd-9a70-a82b00dc2518",
              "ChannelNumber": 100,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.32421875
                }
              ]
            },
            {
              "ChannelFrequency": 657000000,
              "ChannelId": "b7b07f9b-c031-4920-924c-a82b00dc2518",
              "ChannelNumber": 101,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.08203125
                }
              ]
            },
            {
              "ChannelFrequency": 663000000,
              "ChannelId": "1f54f63e-0853-49a2-81ad-a82b00dc2518",
              "ChannelNumber": 102,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.23828125
                }
              ]
            },
            {
              "ChannelFrequency": 669000000,
              "ChannelId": "39da3d64-992e-496d-8a7f-a82b00dc2518",
              "ChannelNumber": 103,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.5078125
                }
              ]
            },
            {
              "ChannelFrequency": 675000000,
              "ChannelId": "e7ee2ed5-2222-423a-89ee-a82b00dc2518",
              "ChannelNumber": 104,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.390625
                }
              ]
            },
            {
              "ChannelFrequency": 681000000,
              "ChannelId": "3c051ec6-c97c-4596-830d-a82b00dc2518",
              "ChannelNumber": 105,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.51171875
                }
              ]
            },
            {
              "ChannelFrequency": 687000000,
              "ChannelId": "3977e7a5-c95c-4984-9084-a82b00dc2518",
              "ChannelNumber": 106,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.546875
                }
              ]
            },
            {
              "ChannelFrequency": 693000000,
              "ChannelId": "85ed244a-6dfa-439f-8d64-a82b00dc2518",
              "ChannelNumber": 107,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.421875
                }
              ]
            },
            {
              "ChannelFrequency": 699000000,
              "ChannelId": "3d844490-0bc9-4afe-845a-a82b00dc2518",
              "ChannelNumber": 108,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.453125
                }
              ]
            },
            {
              "ChannelFrequency": 705000000,
              "ChannelId": "c722eaa2-cc3a-46f7-a1c4-a82b00dc2518",
              "ChannelNumber": 109,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.4140625
                }
              ]
            },
            {
              "ChannelFrequency": 711000000,
              "ChannelId": "5e30d047-f212-43b6-8dfc-a82b00dc2518",
              "ChannelNumber": 110,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.28125
                }
              ]
            },
            {
              "ChannelFrequency": 717000000,
              "ChannelId": "918c5315-f6f1-411a-8fc3-a82b00dc2518",
              "ChannelNumber": 111,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.24609375
                }
              ]
            },
            {
              "ChannelFrequency": 723000000,
              "ChannelId": "d92b2ea2-2788-4c1e-9c5a-a82b00dc2518",
              "ChannelNumber": 112,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.046875
                }
              ]
            },
            {
              "ChannelFrequency": 729000000,
              "ChannelId": "f9d6bb8c-c210-4564-8ecc-a82b00dc2518",
              "ChannelNumber": 113,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.19921875
                }
              ]
            },
            {
              "ChannelFrequency": 735000000,
              "ChannelId": "ba3c4477-5523-4852-8b66-a82b00dc2518",
              "ChannelNumber": 114,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.953125
                }
              ]
            },
            {
              "ChannelFrequency": 741000000,
              "ChannelId": "93b6e0e5-55d2-4b92-a9dc-a82b00dc2518",
              "ChannelNumber": 115,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.04296875
                }
              ]
            },
            {
              "ChannelFrequency": 747000000,
              "ChannelId": "99fc6f42-c16a-485c-8fa6-a82b00dc2518",
              "ChannelNumber": 116,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.046875
                }
              ]
            },
            {
              "ChannelFrequency": 753000000,
              "ChannelId": "ddd7451d-dead-4db9-bbdc-a82b00dc2518",
              "ChannelNumber": 117,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.69921875
                }
              ]
            },
            {
              "ChannelFrequency": 759000000,
              "ChannelId": "25166896-c3d6-4ba4-95a7-a82b00dc2518",
              "ChannelNumber": 118,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.83203125
                }
              ]
            },
            {
              "ChannelFrequency": 765000000,
              "ChannelId": "94bb252b-2683-40d8-bd5f-a82b00dc2518",
              "ChannelNumber": 119,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.8515625
                }
              ]
            },
            {
              "ChannelFrequency": 771000000,
              "ChannelId": "bcdd310d-d98b-4c73-b8d3-a82b00dc2518",
              "ChannelNumber": 120,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.84765625
                }
              ]
            },
            {
              "ChannelFrequency": 777000000,
              "ChannelId": "00401c95-477f-4add-8fb2-a82b00dc2518",
              "ChannelNumber": 121,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.90625
                }
              ]
            },
            {
              "ChannelFrequency": 783000000,
              "ChannelId": "c63bc250-070b-425d-b842-a82b00dc2518",
              "ChannelNumber": 122,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.6328125
                }
              ]
            },
            {
              "ChannelFrequency": 789000000,
              "ChannelId": "bfa83b1b-862e-48aa-b8e3-a82b00dc2518",
              "ChannelNumber": 123,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.828125
                }
              ]
            },
            {
              "ChannelFrequency": 795000000,
              "ChannelId": "fffad770-10b5-4cb3-8312-a82b00dc2518",
              "ChannelNumber": 124,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.14453125
                }
              ]
            },
            {
              "ChannelFrequency": 801000000,
              "ChannelId": "5a27cb82-0682-4214-97c1-a82b00dc2518",
              "ChannelNumber": 125,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.10546875
                }
              ]
            },
            {
              "ChannelFrequency": 807000000,
              "ChannelId": "cc62d19a-bf95-4d13-9f40-a82b00dc2518",
              "ChannelNumber": 126,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.04296875
                }
              ]
            },
            {
              "ChannelFrequency": 813000000,
              "ChannelId": "1da233b4-2b95-4907-97a8-a82b00dc2518",
              "ChannelNumber": 127,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.265625
                }
              ]
            },
            {
              "ChannelFrequency": 819000000,
              "ChannelId": "39cadf21-9655-4b00-ae76-a82b00dc2518",
              "ChannelNumber": 128,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.2890625
                }
              ]
            },
            {
              "ChannelFrequency": 825000000,
              "ChannelId": "434d6e82-48b9-4cb6-88bc-a82b00dc2518",
              "ChannelNumber": 129,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.265625
                }
              ]
            },
            {
              "ChannelFrequency": 831000000,
              "ChannelId": "82156c99-120d-4441-8eb1-a82b00dc2518",
              "ChannelNumber": 130,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.234375
                }
              ]
            },
            {
              "ChannelFrequency": 837000000,
              "ChannelId": "d32a91d8-9ac4-4ee7-bf5f-a82b00dc2518",
              "ChannelNumber": 131,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.42578125
                }
              ]
            },
            {
              "ChannelFrequency": 843000000,
              "ChannelId": "46184a62-acbc-4e36-92fb-a82b00dc2518",
              "ChannelNumber": 132,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.23046875
                }
              ]
            },
            {
              "ChannelFrequency": 849000000,
              "ChannelId": "a506bda2-5ffe-43a5-b6f8-a82b00dc2518",
              "ChannelNumber": 133,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.51953125
                }
              ]
            },
            {
              "ChannelFrequency": 855000000,
              "ChannelId": "2cf862af-ce52-4234-94dc-a82b00dc2518",
              "ChannelNumber": 134,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.29296875
                }
              ]
            },
            {
              "ChannelFrequency": 861000000,
              "ChannelId": "a97b78ac-6d96-4680-8047-a82b00dc2518",
              "ChannelNumber": 135,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.48046875
                }
              ]
            },
            {
              "ChannelFrequency": 867000000,
              "ChannelId": "181332d8-f335-4430-9d72-a82b00dc2518",
              "ChannelNumber": 136,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.37890625
                }
              ]
            },
            {
              "ChannelFrequency": 873000000,
              "ChannelId": "be54ef2b-e540-4c73-b501-a82b00dc2518",
              "ChannelNumber": 137,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.921875
                }
              ]
            },
            {
              "ChannelFrequency": 879000000,
              "ChannelId": "84e49cff-182f-4a76-9b08-a82b00dc2518",
              "ChannelNumber": 138,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.56640625
                }
              ]
            },
            {
              "ChannelFrequency": 885000000,
              "ChannelId": "24f39075-5781-4ff3-a5ea-a82b00dc2518",
              "ChannelNumber": 139,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.9375
                }
              ]
            },
            {
              "ChannelFrequency": 891000000,
              "ChannelId": "c08ff91d-510b-40e9-9900-a82b00dc2518",
              "ChannelNumber": 140,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.83203125
                }
              ]
            },
            {
              "ChannelFrequency": 897000000,
              "ChannelId": "5139352c-2598-4a4b-a917-a82b00dc2518",
              "ChannelNumber": 141,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.98828125
                }
              ]
            },
            {
              "ChannelFrequency": 903000000,
              "ChannelId": "ba60a233-536c-49b2-a7a2-a82b00dc2518",
              "ChannelNumber": 142,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.60546875
                }
              ]
            },
            {
              "ChannelFrequency": 909000000,
              "ChannelId": "704be187-ce54-4e95-a1d3-a82b00dc2518",
              "ChannelNumber": 143,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.96484375
                }
              ]
            },
            {
              "ChannelFrequency": 915000000,
              "ChannelId": "92c0dcbd-621c-45d0-9c3f-a82b00dc2518",
              "ChannelNumber": 144,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.53125
                }
              ]
            },
            {
              "ChannelFrequency": 921000000,
              "ChannelId": "adb465b8-6395-4df9-9ab5-a82b00dc2518",
              "ChannelNumber": 145,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.71875
                }
              ]
            },
            {
              "ChannelFrequency": 921000000,
              "ChannelId": "83f47631-9f68-4a47-a4f6-a82b00dc2518",
              "ChannelNumber": 145,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.73828125
                }
              ]
            },
            {
              "ChannelFrequency": 927000000,
              "ChannelId": "03f7285f-9c51-4fd1-b6e4-a82b00dc2518",
              "ChannelNumber": 146,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.53125
                }
              ]
            },
            {
              "ChannelFrequency": 933000000,
              "ChannelId": "e3c72335-7695-4d6e-90a1-a82b00dc2518",
              "ChannelNumber": 147,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.6640625
                }
              ]
            },
            {
              "ChannelFrequency": 939000000,
              "ChannelId": "97b2814c-4c27-4ebf-a08b-a82b00dc2518",
              "ChannelNumber": 148,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.76171875
                }
              ]
            },
            {
              "ChannelFrequency": 945000000,
              "ChannelId": "c170daf9-b5ef-41aa-99d9-a82b00dc2518",
              "ChannelNumber": 149,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.921875
                }
              ]
            },
            {
              "ChannelFrequency": 951000000,
              "ChannelId": "cad92145-625b-430b-a554-a82b00dc2518",
              "ChannelNumber": 150,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.7265625
                }
              ]
            },
            {
              "ChannelFrequency": 957000000,
              "ChannelId": "048fe897-f3b2-47d7-bcfb-a82b00dc2518",
              "ChannelNumber": 151,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.953125
                }
              ]
            },
            {
              "ChannelFrequency": 963000000,
              "ChannelId": "9137587a-0e08-456b-b677-a82b00dc2518",
              "ChannelNumber": 152,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.953125
                }
              ]
            },
            {
              "ChannelFrequency": 969000000,
              "ChannelId": "6c5c6cd3-59f3-447c-aa97-a82b00dc2518",
              "ChannelNumber": 153,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.08984375
                }
              ]
            },
            {
              "ChannelFrequency": 975000000,
              "ChannelId": "b34b9a78-4858-4fc4-8fb9-a82b00dc2518",
              "ChannelNumber": 154,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.89453125
                }
              ]
            },
            {
              "ChannelFrequency": 981000000,
              "ChannelId": "eef728ec-587e-4b9c-b0ee-a82b00dc2518",
              "ChannelNumber": 155,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -43.0078125
                }
              ]
            },
            {
              "ChannelFrequency": 987000000,
              "ChannelId": "08cca688-670d-40cb-bf0e-a82b00dc2518",
              "ChannelNumber": 156,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.87890625
                }
              ]
            },
            {
              "ChannelFrequency": 993000000,
              "ChannelId": "60f15dd6-5ee5-49ea-bc72-a82b00dc2518",
              "ChannelNumber": 157,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.8125
                }
              ]
            },
            {
              "ChannelFrequency": 999000000,
              "ChannelId": "b7fdde44-8c42-46eb-a91c-a82b00dc2518",
              "ChannelNumber": 158,
              "ChannelType": "Digital",
              "MeasurementValues": [
                {
                  "Name": "DigitalLevel",
                  "Results": {
                    "Failed": true,
                    "FailedType": "MinValue"
                  },
                  "Value": -42.6796875
                }
              ]
            }
          ],
          "MeasurementValues": [
            {
              "Name": "VideoDigitalDelta",
              "Results": {
                "Failed": false
              },
              "Value": -10.70703125
            },
            {
              "Name": "TiltLevel",
              "Results": null,
              "Value": 0.55078125
            },
            {
              "Name": "AdjacentVideoLevel",
              "Results": {
                "Failed": false
              },
              "Value": 1.1015625
            },
            {
              "Name": "VideoDelta",
              "Results": {
                "Failed": false
              },
              "Value": 2.94921875
            }
          ],
          "Name": "Scan",
          "Results": {
            "Failed": true
          }
        }
      ],
      "UserName": "eads-us"
    }
  ],
  "ScreenShots": [
    {
      "Id": "9b2988ec-29e9-4d2f-8f1a-499632c76815",
      "Name": "123456-screen-5",
      "Length": 47081,
      "Data": "not_real_image_data",
      "Time": "2019-03-18T17:18:00Z"
    },
    {
      "Id": "c5a73533-58f4-4874-aa4d-2229df23837e",
      "Name": "246135-screen-1",
      "Length": 46314,
      "Data": "not_real_image_data",
      "Time": "2019-03-18T18:16:52Z"
    }
  ]
};
