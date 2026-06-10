const i2cAddress = 0x25;  // I2C设备地址

enum MotorGroupMotion {
    //% block="forward"
    Forward = 1,

    //% block="backward"
    Backward = 2,

    //% block="turn left"
    TurnLeft = 3,

    //% block="turn right"
    TurnRight = 4
}

enum MotorLR {
    //% block="L"
    Left = 0x50,

    //% block="R"
    Right = 0x6E
}

enum MotorMotion {
    //% block="forward"
    Forward = 1,

    //% block="backward"
    Backward = 2
}


//% color="#6CACE4" icon="" block="Logos ScratchJr"
namespace LogosScratchJr {
    //#########################################################################
    //################################## 运动(双电机) #########################
    //#########################################################################
    //% blockId=motorGroupMove
    //% block="move %motion at speed %speed"
    //% group="Motor Group"
    //% weight=100
    //% speed.min=0 speed.max=100 speed.defl=50
    export function motorGroupMove(motion: MotorGroupMotion, speed: number): void {
        if (speed > 100) speed = 100;
        if (speed < 0) speed = 0;

        const BASE = 0x8C;

        // 设置速度
        let speedBuf = pins.createBuffer(3);
        speedBuf[0] = BASE + 0x01;
        speedBuf[1] = speed;
        speedBuf[2] = speed;
        pins.i2cWriteBuffer(i2cAddress, speedBuf);

        // 执行运动
        let cmdBuf = pins.createBuffer(2);
        cmdBuf[0] = BASE + 0x00;
        cmdBuf[1] = motion;
        pins.i2cWriteBuffer(i2cAddress, cmdBuf);
    }
    

    //% blockId=motorGroupStop
    //% block="stop motors"
    //% group="Motor Group"
    //% weight=99
    export function motorGroupStop(): void {
        const BASE = 0x8C;
        let cmdBuf = pins.createBuffer(2);
        cmdBuf[0] = BASE + 0x00;
        cmdBuf[1] = 0;

        pins.i2cWriteBuffer(i2cAddress, cmdBuf);
    }

    //#########################################################################
    //################################## 单电机 #########################
    //#########################################################################
    //% blockId=motorSpeed
    //% block="get %motor motor speed"
    //% group="Motor"
    //% weight=89
    export function motorSpeed(motor: MotorLR): number {
        let BASE = motor + 0x00;
        let cmdBuf = pins.createBuffer(1);
        cmdBuf[0] = BASE;

        pins.i2cWriteBuffer(i2cAddress, cmdBuf);

        let readBuf = pins.i2cReadBuffer(i2cAddress, 1);
        return readBuf.getNumber(NumberFormat.Int8BE, 0);
    }
   
    //% blockId=motorMove
    //% block="%motor motor %motion at speed %speed"
    //% group="Motor"
    //% weight=88
    //% speed.min=0 speed.max=100 speed.defl=50
    export function motorMove( motor: MotorLR, motion: MotorMotion, speed: number ): void {

        if (speed > 100) speed = 100;
        if (speed < 0) speed = 0;

        // 设置功率
        let powerBuf = pins.createBuffer(2);
        powerBuf[0] = motor + 0x02;
        powerBuf[1] = speed;
        pins.i2cWriteBuffer(i2cAddress, powerBuf);

        // 设置运动方向
        let cmdBuf = pins.createBuffer(2);
        cmdBuf[0] = motor + 0x01;
        cmdBuf[1] = motion;
        pins.i2cWriteBuffer(i2cAddress, cmdBuf);
    }

    //% blockId=motorStop
    //% block="%motor motor stop"
    //% group="Motor"
    //% weight=88
    //% speed.min=0 speed.max=100 speed.defl=50
    export function motorStop(motor: MotorLR): void {
        // 设置功率
        let powerBuf = pins.createBuffer(2);
        powerBuf[0] = motor + 0x02;
        powerBuf[1] = 0;
        pins.i2cWriteBuffer(i2cAddress, powerBuf);

        // 设置运动方向
        let cmdBuf = pins.createBuffer(2);
        cmdBuf[0] = motor + 0x01;
        cmdBuf[1] = 0;
        pins.i2cWriteBuffer(i2cAddress, cmdBuf);
    }




}