# discovergy-export

<a href="https://stromdao.de/" target="_blank" title="STROMDAO - Digital Energy Infrastructure"><img src="./static/stromdao.png" align="right" height="85px" hspace="30px" vspace="30px"></a>

**Data dump for Discovergy Metering.**

[![npm](https://img.shields.io/npm/dt/discovergy-export.svg)](https://www.npmjs.com/package/discovergy-export)
[![npm](https://img.shields.io/npm/v/discovergy-export.svg)](https://www.npmjs.com/package/discovergy-export)
[![CO2Offset](https://api.corrently.io/v2.0/ghgmanage/statusimg?host=discovergy-export&svg=1)](https://co2offset.io/badge.html?host=discovergy-export)
[![Join the chat at https://gitter.im/stromdao/tydids-p2p](https://badges.gitter.im/stromdao/tydids-p2p.svg)](https://gitter.im/stromdao/tydids-p2p?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)




```
npm install -g discovergy-export

Usage: discovergy-export [options]

Options:
  -u --username [discovergy_account]   Discovergy Portal User - Email
  -p --password [discovergy_password]  Discovergy Portal Password
  -m --meterId [meterId]               API MeterId (this is not the administration number!)
  --from [timestamp]                   Timestamp start readings with
  --to [timestamp]                     Timestamp to end readings with
  --resolution [resolution]            Resolution of aggregated data
  --save [basename]                    Save output to filesystem using given basename (if not print on console)
  --split                              Split into seperate files (only with --save option)
  --format [format]                    Output format (eq. csv, json)
  --fields [fieldlist]                 Comma seperated list of fields. If not specified all fields of first meter are used.
  --all                                Retrieve all data of meter (no timeframe). Check resolution option against API limits!
  -h, --help                           display help for command
```

## Samples

Dump all meter, on screen, json format, resolution fifteen minutes, last 24 hours
```
discovergy-export -u demo@discovergy.com -p demo
```

Dump all meter, on screen, json format, resolution one month, full history
```
discovergy-export -u demo@discovergy.com -p demo --all --resolution one_month
```

Dump all meter, on screen, csv format, resolution one month, full history
```
discovergy-export -u demo@discovergy.com -p demo --format csv --all --resolution one_month
```

Dump all meter, in one file, json format, resolution fifteen minutes, last 24 hours
```
discovergy-export -u demo@discovergy.com -p demo --save
```

Dump all meter, in seperate files, json format, resolution fifteen minutes, last 24 hours
```
discovergy-export -u demo@discovergy.com -p demo --save --split
```

## Usage Hints

### Supported date formats
discovergy-export uses [moment.js](https://momentjs.com/) to parse dates. So any [format supported](https://momentjs.com/docs/#/parsing/) is possible as from/to format.

### Possible resolutions and limits

| resolution   |      maximum time span (to - from)      |
|----------|:-------------:|
| raw |  1 day |
| three_minutes |  10 days |
| fifteen_minutes | 31 days |
| one_hour |  93 days |
| one_day |  10 years |
| one_week |  20 years |
| one_month |  50 years |

## Maintainer / Imprint

<addr>
STROMDAO GmbH  <br/>
Gerhard Weiser Ring 29  <br/>
69256 Mauer  <br/>
Germany  <br/>
  <br/>
+49 6226 968 009 0  <br/>
  <br/>
kontakt@stromdao.com  <br/>
  <br/>
Handelsregister: HRB 728691 (Amtsgericht Mannheim)
</addr>

Project Website: https://tydids.com/

## [CONTRIBUTING](https://github.com/energychain/tydids-p2p/blob/main/CONTRIBUTING.md)

## [CODE OF CONDUCT](https://github.com/energychain/tydids-p2p/blob/main/CODE_OF_CONDUCT.md)
