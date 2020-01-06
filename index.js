
var version = require("package").version;
var inherits = require("util").inherits;
var Service, Characteristic;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-delay-switch", "DelaySwitch", delaySwitch);
}


function delaySwitch(log, config) {
    this.log = log;
    this.name = config.name;
    this.delay = config.delay;
    this.disableSensor = config.disableSensor || false;
    this.timer;
    this.switchOn = false;
    this.motionTriggered = false;

}

delaySwitch.prototype.getServices = function () {
    var informationService = new Service.AccessoryInformation();

    informationService
        .setCharacteristic(Characteristic.Manufacturer, "Delay Manufacturer")
        .setCharacteristic(Characteristic.Model, "Delay Model")
        .setCharacteristic(Characteristic.SerialNumber, version);


    this.switchService = new Service.Switch(this.name);


    this.switchService.getCharacteristic(Characteristic.On)
        .on('get', this.getOn.bind(this))
        .on('set', this.setOn.bind(this));
 
    // DelaySwitchTimeout Characteristic
    Characteristic.DelaySwitchTimeout = function () {
      Characteristic.call(this, 'Delay', 'B469181F-D796-46B4-8D99-5FBE4BA9DC9C');

      this.setProps({
        format: Characteristic.Formats.INT,
        unit: Characteristic.Units.SECONDS,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE],
        minValue: 1,
        maxValue: 3600,
      });

      this.value = this.getDefaultValue();
    };
    inherits(Characteristic.DelaySwitchTimeout, Characteristic);
    Characteristic.DelaySwitchTimeout.UUID = 'B469181F-D796-46B4-8D99-5FBE4BA9DC9C';

    this.switchService.addCharacteristic(Characteristic.DelaySwitchTimeout);
    this.switchService.updateCharacteristic(Characteristic.DelaySwitchTimeout, this.delay);
    this.switchService.getCharacteristic(Characteristic.DelaySwitchTimeout)
      .on('get', this.getDelay.bind(this))
      .on('set', this.setDelay.bind(this));

    var services = [informationService, this.switchService]
    
    if (!this.disableSensor){
        this.motionService = new Service.MotionSensor(this.name + ' Trigger');

        this.motionService
            .getCharacteristic(Characteristic.MotionDetected)
            .on('get', this.getMotion.bind(this));
        services.push(this.motionService)
    }

    return services;

}


delaySwitch.prototype.setOn = function (on, callback) {

    if (!on) {
        this.log('Stopping the Timer.');
    
        this.switchOn = false;
        clearTimeout(this.timer);
        this.motionTriggered = false;
        if (!this.disableSensor) this.motionService.getCharacteristic(Characteristic.MotionDetected).updateValue(false);

        
      } else {
        this.log('Starting the Timer.');
        this.switchOn = true;
    
        clearTimeout(this.timer);
        this.timer = setTimeout(function() {
          this.log('Time is Up!');
          this.switchService.getCharacteristic(Characteristic.On).updateValue(false);
          this.switchOn = false;
            
          if (!this.disableSensor) {
              this.motionTriggered = true;
              this.motionService.getCharacteristic(Characteristic.MotionDetected).updateValue(true);
              this.log('Triggering Motion Sensor');
              setTimeout(function() {
                  this.motionService.getCharacteristic(Characteristic.MotionDetected).updateValue(false);
                  this.motionTriggered = false;
              }.bind(this), 3000);
          }
          
        }.bind(this), this.delay * 1000);
      }
    
      callback();
}



delaySwitch.prototype.getOn = function (callback) {
    callback(null, this.switchOn);
}

delaySwitch.prototype.getMotion = function(callback) {
    callback(null, this.motionTriggered);
}

delaySwitch.prototype.getDelay = function (callback) {
    callback(this.delay);
}

delaySwitch.prototype.setDelay = function (value, callback) {
    this.delay = value;
    callback();
}

