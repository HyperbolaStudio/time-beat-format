# Time-Beat-Format

Formatting time, notes and beats.

# Get Started

```bash
npm install @hypst/time-beat-format
```

The module can work both in Node.js and browsers.

The module itself includes `d.ts` TypeScript definitions.

# Usage

```javascript
const timeFormat = require('@hypst/time-format');

let timeObj1 = new timeFormat.HMSTime('1:5.5');
console.log(timeObj.toString()); //1:5.500

let option = {
    bpm:120,
    beatsPerNote:4,
    divisionsPerBeat:16,
    isRelativeTime:false;
};
let timeObj2 = new timeFormat.BeatTime(option,'5:0.0');
console.log(timeObj.toString()); //5:0.0
```

## `timeFormat.HMSTime`

`HMSTime` class represents a relative time or absolute time.

### `constructor(...args)`

5 overloads:

 - `constructor(option?)`

 - `constructor(timeStr,option?)`

 - `constructor(hour,minute,second,millisecond,option?)`

 - `constructor(millisecond,option?)`

 - `constructor(timeObj,option?)`

Parameters:

#### `option`

Properties of `option`:

|Property|Description|
|-|-|
|`numberWidthOption`|(Optional) Set the width of number when converted to string.|

Properties of `numberWidthOption`:

|Property|Description|
|-|-|
|`hour`|(Optional) Minium width of hour.|
|`minute`|(Optional) Minium width of minute.|
|`second`|(Optional) Minium width of second.|
|`millisecond`|(Optional) Width of millisecond.|

If width is set to `-1`, the target value will be converted to string when it equals `0`.

For millisecond, the number will be rounded to the specified width when the width of original number is greater than the specified width.

Example:
```javascript
const {HMSTime} = require('@hypst/time-format');

let option = {
    numberWidthOption:{
        hour:-1,
        minute:1,
        second:2,
        millisecond:2,
    },
};

let t1 = new HMSTime('01:00.000',option);
console.log(t1.toString()); //1:00.00

let t2 = new HMSTime('12:5.558',option);
console.log(t2.toString()); //12:05.56

let t3 = new HMSTime('1:5:2.663');
console.log(t3.toString()); //1:5:02.66
```

#### `timeStr`

Time string. Hour, minute, second are separated by colons and second and millisecond are separated by dot.

Both half-width(`:` `.`) and full-width(`：` `．` `。`) symbols can be recognized.

```javascript
const {HMSTime} = require('@hypst/time-format');

let t1 = new HMSTime('1:1:13.0'); //1:1:13.000
let t2 = new HMSTime('1:.35'); //0:1:0.350
let t3 = new HMSTime('.5'); //0:0:0.500
let t4 = new HMSTime('3'); //0:0:3.000
let t5 = new HMSTime('19：26：08。17'); //19:26:8.170
let t6 = new HMSTime('1:63.5'); //0:2:3.500
```

#### `hour`, `minute`, `second` and `millisecond`

```javascript
const {HMSTime} = require('@hypst/time-format');

let t1 = new HMSTime(69968170); //19:26:8.170
let t2 = new HMSTime(19,26,8,170); //19:26:8.170
```

#### `timeObj`

An `HMSTime` instance. 

If no parameter, the time will be initialized to `0:0:0.000`.

### `hour`, `minute`, `second` and `millisecond`

```javascript
const {HMSTime} = require('@hypst/time-format');

let t1 = new HMSTime('19:26:8.17');
console.log(t1.minute); //26
t1.minute = 63;
console.log(t1.hour,t1.minute); //20 3
```

### `parseString(timeStr)`

Parse an `HMSTime` object from string. 

See `timeStr` parameter in constructor function.

### `parseNumber(hour,minute,second,millisecond)`

See `hour`, `minute`, `second`, `millisecond` parameters in constructor function.

### `toString()`

Convert an `HMSTime` object to string.

### `toMillisecond()`

Convert an `HMSTime` object to millisecond.

```javascript
const {HMSTime} = require('@hypst/time-format');

let t1 = new HMSTime(69968170);
console.log(t1.toMillisecond()); //69968170
```

### `increase(time)`

Parameter `time` is an `HMSTime` object.

```javascript
const {HMSTime} = require('@hypst/time-format');

let t1 = new HMSTime('2:8.3');
t1.increase(new HMSTime('1:17.5'));
console.log(t1); //0:3:25.800
```

### `reduce(time)`

Parameter `time` is an `HMSTime`.

```javascript
const {HMSTime} = require('@hypst/time-format');

let t1 = new HMSTime('2:8.3');
t1.reduce(new HMSTime('1:17.5'));
console.log(t1); //0:0:50.8
```

It's worth noting that if the result is less than `0`, it will be set to `0:0:0.0`.

### `offset(time)`

Parameter `time` is an `HMSTime`.

```javascript
const {HMSTime} = require('@hypst/time-format');

let t1 = new HMSTime('2:8.3');
console.log(t1.offset(new HMSTime('3:25.8'))); //-77750
```

## `timeFormat.BeatTime`

A class to represent time, in `note:beat.division`.

"division" represents "subdivision".

### `constructor(...args)`

5 overloads:

 - `constructor(option,s);`
 - `constructor(option,note,beat,division);`
 - `constructor(option,hmsTime);`
 - `constructor(option,beatTime);`
 - `constructor(option);`

#### `option`

Properties:

|Property|Description|
|-|-|
|`bpm`|Beats per minute.|
|`beatsPerNote`|Beats per note.|
|`divisionsPerBeat`|Subdivisions per beat.|
|`isRelativeTime`|Boolean, for relative ones, beat and note start from `0`, for absolute ones, beat and note starts from `1`.|
|`numberWidthOption`|(Optional) Set the width of number when converted to string.|

Properties of `numberWidthOption`:

|Property|Description|
|-|-|
|`note`|(Optional) Minium width of note.|
|`beat`|(Optional) Minium width of beat.|
|`division`|(Optional) Minium width of subdivision.|

Other parameters are just like those in `HMSTime`.

### `note`, `beat`, `division`

### `parseString(s)`, `parseNumber(note,beat,division)` `parseHMSTime(t)`

### `toString()`, `toHMSTime()`

Usages are just like those in `HMSTime`.