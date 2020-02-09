import { fillNumberWidth, fixNumberWidth } from "./utils";
import { NegativeValueError, HMSTimeOption } from "./definitions";

export class HMSTime{


    static HMS_REGEXP = /^([0-9]*)(:|：)?([0-9]*)(:|：)?([0-9]*)(\.|。|．)?([0-9]*)$/;


    constructor(hour:number,minute:number,second:number,millisecond:number,option?:HMSTimeOption);
    constructor(millisecond:number,option?:HMSTimeOption);
    constructor(s:string,option?:HMSTimeOption);
    constructor(timeObj:HMSTime,option?:HMSTimeOption);
    constructor();
    constructor(...args:any[]){
        if(args.length==0){

        }else if(typeof(args[0]) == 'string'){
            this.parseString(args[0]);
            this._option = args[1];
        }else if(typeof(args[0]) == 'number' && typeof(args[1]) == 'number'){
            this.parseNumber(...args);
            this._option = args[4];
        }else if(typeof(args[0]) == 'number'){
            this.parseNumber(0,0,0,args[0]);
            this._option = args[1];
        }else if(args[0] instanceof HMSTime){
            this._hour = args[0]._hour;
            this._minute = args[0]._minute;
            this._second = args[0]._second;
            this._millisecond = args[0]._millisecond;
        }
    }


    protected _hour:number = 0;
    protected _minute:number = 0;
    protected _second:number = 0;
    protected _millisecond:number = 0;
    protected _option:HMSTimeOption = {};
    get hour():number{
        return this._hour;
    }
    get minute():number{
        return this._minute;
    }
    get second():number{
        return this._second;
    }
    get millisecond():number{
        return this._millisecond;
    }


    parseNumber(hour?:number,minute?:number,second?:number,millisecond?:number):this{
        if((hour&&hour<0)||(minute&&minute<0)||(second&&second<0)||(millisecond&&millisecond<0)){
            throw new NegativeValueError();
        }
        if(hour!==undefined){
            this._hour = hour;
        }
        if(minute!==undefined){
            this._minute = minute;
        }
        if(second!==undefined){
            this._second = second;
        }
        if(millisecond!==undefined){
            this._millisecond = millisecond;
        }
        this._second+=Math.floor(this.millisecond/1000);
        this._millisecond%=1000;
        this._minute+=Math.floor(this.second/60);
        this._second%=60;
        this._hour+=Math.floor(this.minute/60);
        this._minute%=60;
        
        return this;
    }

    parseString(s:string):this{
        s.replace(HMSTime.HMS_REGEXP,(match,d1,p2,d2,p4,d3,p6,d4)=>{
            let hourStr = "";
            let minuteStr = "";
            let secondStr = "";
            let millisecondStr = "";

            if(d3){
                secondStr = d3;
                minuteStr = d2;
                hourStr = d1;
            }else if(d2){
                secondStr = d2;
                minuteStr = d1;
            }else{
                secondStr = d1;
            }
            if(d4){
                millisecondStr = d4;
            }
            while(millisecondStr.length<3){
                millisecondStr+='0';
            }
            this.parseNumber(
                Number(hourStr),
                Number(minuteStr),
                Number(secondStr),
                Number(millisecondStr),
            );
            
            return match;
        });
        return this;
    }


    toString():string{
        let hour = fillNumberWidth(this.hour,this._option?.numberWidthOption?.hour);
        let minute = fillNumberWidth(this.minute,this._option?.numberWidthOption?.minute);
        let second = fillNumberWidth(this.second,this._option?.numberWidthOption?.second);
        let millisecond = fixNumberWidth(this.millisecond,this._option?.numberWidthOption?.millisecond);
        if(hour)hour+=':';
        if(minute)minute+=':';
        if(millisecond)millisecond = '.'+millisecond;
        return hour+minute+second+millisecond;
    }

    toMillisecond():number{
        return this.hour*60*60*1000 + this.minute*60*1000 + this.second*1000 + this.millisecond;
    }


    increase(timeObj:HMSTime):this{
        return this.parseNumber(
            this.hour+timeObj.hour,
            this.minute+timeObj.minute,
            this.second+timeObj.second,
            this.millisecond+timeObj.millisecond
        );
    }

    reduce(timeObj:HMSTime):this{
        this._hour -= timeObj.hour;
        this._minute -= timeObj.minute;
        this._second -= timeObj.second;
        this._millisecond -= timeObj.millisecond;

        if(this.millisecond<0){
            this._millisecond+=1000;
            this._second-=1;
        }
        if(this.second<0){
            this._second+=60;
            this._minute-=1;
        }
        if(this.minute<0){
            this._minute+=60;
            this._hour-=1;
        }
        if(this.hour<0){
            return this.parseNumber(0,0,0,0);
        }
        return this;
    }

    offset(timeObj:HMSTime):number{
        return (this.millisecond-timeObj.millisecond)+(this.second-timeObj.second)*1000+(this.minute-timeObj.minute)*60*1000+(this.hour-timeObj.hour)*60*60*1000;
    }


}