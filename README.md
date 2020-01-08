
# Homebridge-Random-Delay-Switch

With this plugin, you can create any number of fake switches that will start a timer, which can be a random duration too (between 1 second and your configured value), when turned ON, when the delay time is reached the switch will automatically turn OFF and trigger a dedicated motion sensor for 3 seconds. This can be very useful for advanced automation with HomeKit scenes - when delayed actions are required.

The random duration is very useful if you want an automation which simulates your precense at home by switch lights at a random time. This looks more realisitic than a statically configured on/off-time.

## How to install

 * ```sudo npm install -g homebridge-random-delay-switch```
* Create an accessory in your config.json file
* Restart homebridge

## Example config.json:

 ```
    "accessories": [
        {
          "accessory": "RandomDelaySwitch",
          "name": "MyDelaySwitchName",
          "disableSensor": false,
          "delay": 60,
          "random": false
        }
    ]

```
This gives you a switch which will trigger the motion sensor after 60 seconds.

```
    "accessories": [
        {
          "accessory": "RandomDelaySwitch",
          "name": "MyRandomDelaySwitchName",
          "disableSensor": false,
          "delay": 1800,
          "random": true
        }   
    ]

```
This gives you a switch will will trigger the motion sensor after a random delay between 1 to 1800 seconds .

## Why Adding Motion Sensor?

A Motion sensor is created for each accessory in order to be able to cancel the timer and the attached automations.
How it works? you can set the automation to be triggered from the motion sensor instead of the switch OFF command and therefore
you can turn OFF the switch and prevent the motion sensor from being triggered or any attached automations.
If you have no use of the sensor you can remove it by adding `"disableSensor": true` to your config.

## How it works

Basically, all you need to do is:
1. Set the desired delay time in the config file (in seconds).
2. The plugin will create one switch and one motion sensor for this plugin.
3. Use this switch in any scene or automation.
4. Set an automation to trigger when this switch is turned ON or the motion sensor is triggered - The "EVE" app is very recommended to set
these kind of automations.

## Why do we need this plugin?

The main puprose is to use it with the random feature. This way you can simulate your presence at home by switch lights on and off at
a random time around a configured starting time, e.g. set an automation to start at 7:00 PM, a delay of 1800 seconds and set random to true.
Now the motion switch will be triggered between 7:00 PM and 7:30 PM at a random time.

Other examples are, when using smart wall switch (to turn ON) and RGB light bulb (to switch color) together on the same scene can cause
no action on the bulb since the bulb might not even be ON when the command has been sent from homebridge.
For that, we need to set an automation to change the bulb color a few seconds after the wall switch ON command.
Another example is using this plugin to turn ON/OFF lights based on a motion/door sensor. This can be achieved by setting an automation
to turn ON a light when the delay swich is turned ON and turn OFF the light when the dedicated delay motion sensor is triggers.
Also it can be use with any device that require a certain delay time from other devices (TV + RPi-Kodi  /  PC + SSH / etc...)

## Good to know

* **When manualy turning OFF the switch, the timer will stop and the motion sensor will NOT be triggered.**

* **When the delay switch is getting ON command while it's already ON, the timer will restart and the motion sensor trigger will be delayed.**

## Thanks
This switch is based on [Homebridge-Delay-Switch](https://github.com/nitaybz/homebridge-delay-switch) and [Homebridge-Automation-Switches](https://github.com/grover/homebridge-automation-switches).
Many Thanks to @nitaybz and @grover for their good work, without that, this plugin would have never been realized so easily.
