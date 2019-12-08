function _num_width(num:number,width:number,fill:number):string{
    let s:string=num.toString();
    while(s.length<width){
        s=fill.toString()+s;
    }
    return s;
}

export class NegativeValueError extends TypeError{
    constructor(message?:string){
        super(message||"Value shouldn't be negative.");
    }
}
export class HMSTime{


    static HMS_REGEXP = /^([0-9]*)(:|：)?([0-9]*)(:|：)?([0-9]*)(\.|。)?([0-9]*)$/;


    constructor(hour:number,minute:number,second:number,millisecond:number);
    constructor(millisecond:number);
    constructor(s:string);
    constructor();
    constructor(...args:any[]){
        if(args.length==0){

        }else if(typeof(args[0]) == 'string'){
            this.parseString(args[0]);
        }else if(typeof(args[0]) == 'number' && typeof(args[1]) == 'number'){
            this.parseNumber(...args);
        }else if(typeof(args[0]) == 'number'){
            this.parseNumber(0,0,0,args[0]);
        }
    }


    protected _hour:number = 0;
    protected _minute:number = 0;
    protected _second:number = 0;
    protected _millisecond:number = 0;
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
        return `${this.hour?this.hour:''}${this.hour?':':''}${_num_width(this.minute,2,0)}:${_num_width(this.second,2,0)}.${_num_width(this.millisecond,3,0)}`;
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