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
      "Data": "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djbj04UFBjqsWzf0CS9uQLt2XXv33VChkCEigYDZt2/ShAn7tPMF29iYPP98u1de6fbwYeWYMT82X01r16I+Zy8v682bR33++bBjx5Kio9Nv3swrKJCJRIKgIMfFi/toLw567tx9zfauXdfeey9U87v9zju91Wr2888v8I3DTk5m06d38vOzfeWV36iF3S8A6MnGxphvt25oHqxnTWFhlVLJisUCOzsT3cFo//5t3dwsz5xJu3Ahk4g+/3yYq6vFmTNplZXK+fO7KxTq9etjjh9Peu+9vs89519aKv/003OaJhXtcz/9dMiQIV5E5OJivnfvRCLasuXSmTPp1d5u5EifWbM6E9GMGb/Uugrh5s2jJBKhQqEeMOA7vkpEZGkpsbf/e+xyaamcf4z26OEaGzuXiCZMaK8JsEpK5D17huvzKU2YsP+vvx71md68mffrr5OJKCTE9YkCLCI6XGC3LcdlXh0dhdElVp/cb1vroYcPK8eN23Py5EzNajAMQxMntp84sX2DKqSnyMjUrl2d+W1bW5O7d9+Ijk6XSET9+rV9wjDZsBITCz//PGbJkj78y27dnJOS3rx0KTs7u0wqFXt4WPn72/Hz1DQ/BC1KC/ycjY1Fzz/f7vnn29VVoLxcsXPn32nxk5OL1q07v2xZX/4lw9C774YuWdInL69CLBbyTeU///zoS0ULvF8AqBfffJWfLzPgGsb/Vvn5lfxgCd0B1siRvh062FdVqbZsiSei0aP9/P1tBwzw0MxADA11j4pK0zTt9+rl5u+/iW8+0D53xAgffp1ic3MjfprX8eNJNQMsf387/ujs2QdrBlheXtZ8AucDBxI00RURlZTIS0pqSQulyc+uPRvJyEg4fvzfD44TJ5L58Vs1aaIrItL8RKWm1t77pEMtz4zlaV7HCquv8kFEdytNw+75V+sc1HbpUnafPju0a1YX7onXN16/PkY7w725udGoUb6DB3uKxYLVq6Oe8OKG9d57p7TXVBaJBL16tZkwIWDECJ927ezqygLQQrSiz5mnUKinT/+l2iir5csjqyX9EggYJyczzUAEjVZ3vwBAj6cQovlKH/yfuMZNWjczM+rSZVv79ps5jgQCpnNnp3btvurTZycRSSTCaquv8gYP3vX999eJKCmp0Nn5c2fnz/ftq2WAEMtyajWnVnO1hgf8qidEdPWqrvnvJiai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",
      "Time": "2019-03-18T17:18:00Z"
    },
    {
      "Id": "c5a73533-58f4-4874-aa4d-2229df23837e",
      "Name": "246135-screen-1",
      "Length": 46314,
      "Data": "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djbj04UFBjqsWzf0CS9uQLt2XXv33VChkCEigYDZt2/ShAn7tPMF29iYPP98u1de6fbwYeWYMT82X01r16I+Zy8v682bR33++bBjx5Kio9Nv3swrKJCJRIKgIMfFi/toLw567tx9zfauXdfeey9U87v9zju91Wr2888v8I3DTk5m06d38vOzfeWV36iF3S8A6MnGxphvt25oHqxnTWFhlVLJisUCOzsT3cFo//5t3dwsz5xJu3Ahk4g+/3yYq6vFmTNplZXK+fO7KxTq9etjjh9Peu+9vs89519aKv/003OaJhXtcz/9dMiQIV5E5OJivnfvRCLasuXSmTPp1d5u5EifWbM6E9GMGb/Uugrh5s2jJBKhQqEeMOA7vkpEZGkpsbf/e+xyaamcf4z26OEaGzuXiCZMaK8JsEpK5D17huvzKU2YsP+vvx71md68mffrr5OJKCTE9YkCLCI6XGC3LcdlXh0dhdElVp/cb1vroYcPK8eN23Py5EzNajAMQxMntp84sX2DKqSnyMjUrl2d+W1bW5O7d9+Ijk6XSET9+rV9wjDZsBITCz//PGbJkj78y27dnJOS3rx0KTs7u0wqFXt4WPn72/Hz1DQ/BC1KC/ycjY1Fzz/f7vnn29VVoLxcsXPn32nxk5OL1q07v2xZX/4lw9C774YuWdInL69CLBbyTeU///zoS0ULvF8AqBfffJWfLzPgGsb/Vvn5lfxgCd0B1siRvh062FdVqbZsiSei0aP9/P1tBwzw0MxADA11j4pK0zTt9+rl5u+/iW8+0D53xAgffp1ic3MjfprX8eNJNQMsf387/ujs2QdrBlheXtZ8AucDBxI00RURlZTIS0pqSQulyc+uPRvJyEg4fvzfD44TJ5L58Vs1aaIrItL8RKWm1t77pEMtz4zlaV7HCquv8kFEdytNw+75V+sc1HbpUnafPju0a1YX7onXN16/PkY7w725udGoUb6DB3uKxYLVq6Oe8OKG9d57p7TXVBaJBL16tZkwIWDECJ927ezqygLQQrSiz5mnUKinT/+l2iir5csjqyX9EggYJyczzUAEjVZ3vwBAj6cQovlKH/yfuMZNWjczM+rSZVv79ps5jgQCpnNnp3btvurTZycRSSTCaquv8gYP3vX999eJKCmp0Nn5c2fnz/ftq2WAEMtyajWnVnO1hgf8qidEdPWqrvnvJiai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",
      "Time": "2019-03-18T18:16:52Z"
    }
  ]
};
