var Service, Characteristic;

'use strict';

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-wilkie-switch", "PoolControlTest", mySwitch);
};




mySwitch.prototype.getServices = function () {
    let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Jordan Scott")
      .setCharacteristic(Characteristic.Model, "1o2h3f4u5c6k7y8e9a0h")
      .setCharacteristic(Characteristic.SerialNumber, "123-456-789");

    let switchService = new Service.Switch("Wilkie Switch");
    switchService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getSwitchOnCharacteristic.bind(this))
      .on('set', this.setSwitchOnCharacteristic.bind(this));

    this.informationService = informationService;
    this.switchService = switchService;
    return [informationService, switchService];
  }




const request = require('request');
const url = require('url');

function mySwitch(log, config) {
  this.log = log;
  this.getUrl = url.parse(config['getUrl']);
  this.postUrl = url.parse(config['postUrl']);
}

mySwitch.prototype = {

  getSwitchOnCharacteristic: function (next) {
    const me = this;
    request({
      url: me.getUrl,
      method: 'GET',
      body: {
      	command:"RequestParamList",
      	objectList:[{
      		objnam:"C0002",
      		keys:['STATUS']}],
      		messageID:"c03783a6-3fb4-4fa1-85bc-035504f1d672"
      },
    },
    function (error, response, body) {
      if (error) {
        me.log('STATUS: ' + response.statusCode);
        me.log(error.message);
        return next(error);
      }
      return next(null, body.currentState);
    });
  },

  setSwitchOnCharacteristic: function (on, next) {
    const me = this;
    request({
      url: me.postUrl,
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: {
      	command:"SETPARAMLIST",
    	messageID:"d391695b-b754-40dd-95f1-6fdff5582aa1",
    	objectList:[{
    		objnam:"C0002",
    		params:{STATUS:"ON"}}]
      }
    },
    function (error, response) {
      if (error) {
        me.log('STATUS: ' + response.statusCode);
        me.log(error.message);
        return next(error);
      }
      return next();
    })
   },

    setSwitchOnCharacteristic: function (off, next) {
    const me = this;
    request({
      url: me.postUrl,
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: {
      	command:"SETPARAMLIST",
    	messageID:"d391695b-b754-40dd-95f1-6fdff5582aa1",
    	objectList:[{
    		objnam:"C0002",
    		params:{STATUS:"OFF"}}]
      }
    },
    function (error, response) {
      if (error) {
        me.log('STATUS: ' + response.statusCode);
        me.log(error.message);
        return next(error);
      }
      return next();
    });
  }
};





