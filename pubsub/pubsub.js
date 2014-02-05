/**
 * Конструктор класса обмена сообщениями
 * @constructor
 */
function PubSub(){
    'use strict';

    this._globalHandlers = {};

    /**
     * Функция для определения наличия handler функции
     * @param  {string} eventName имя события
     * @param  {function} handler функция которая будет вызвана при возникновении события
     * @return {int}         индекс найденого элемента или -1 в случае провала поиска
     */
    this._isExist = function(eventName, handler){
        var flag = 0,
            eventHandlers = this._globalHandlers[eventName];

        for(flag; flag < eventHandlers.length; flag++){
            /* Comparing the functions by conversion to String (adding '' or call toString method) */
            if('' + eventHandlers[flag] === '' + handler)
                return flag;
        }

        return -1;
    }
};

/**
 * Функция подписки на событие
 * @param  {string} eventName имя события
 * @param  {function} handler функция которая будет вызвана при возникновении события
 * @return {function}         ссылка на handler
 */
PubSub.prototype.subscribe = function(eventName, handler) {

    if(typeof this._globalHandlers[eventName] === 'undefined') this._globalHandlers[eventName] = [];

    this._globalHandlers[eventName].push(handler);
    return handler;
};

/**
 * Функция отписки от события
 * @param  {string} eventName имя события
 * @param  {function} handler функция которая будет отписана
 * @return {function}         ссылка на handler
 */
PubSub.prototype.unsubscribe = function(eventName, handler) {
    var eventHandlers = this._globalHandlers[eventName],
        currentHandlerIndex;

    if(typeof eventHandlers === 'undefined') throw new Error('No such Event');

    currentHandlerIndex = this._isExist(eventName, handler);

    if(currentHandlerIndex === -1)  throw new Error('No such Handler');

    eventHandlers.splice(currentHandlerIndex, 1);
    return handler;
};

/**
 * Функция генерирующая событие
 * @param  {string} eventName имя события
 * @param  {object} data      данные для обработки соответствующими функциями
 * @return {boolean}             удачен ли результат операции
 */
PubSub.prototype.publish = function(eventName, data) {
    var eventHandlers = this._globalHandlers[eventName];

    if(typeof eventHandlers === 'undefined' || eventHandlers.length === 0)
        return false;

    eventHandlers.forEach(function(handler){
       setTimeout( handler(eventName, data), 1);
    })

    return true;
};

/**
 * Функция отписывающая все функции от определённого события
 * @param  {string} eventName имя события
 * @return {boolean}             удачен ли результат операции
 */
PubSub.prototype.off = function(eventName) {
    if(typeof this._globalHandlers[eventName] === 'undefined')
        return false;

    this._globalHandlers[eventName] = undefined;
    return true;
};

/*
 Дополнительный вариант — без явного использования глобального объекта
 нужно заставить работать методы верно у любой функции
 */

/**
 * Создание экземпляра класса PubSub в глобальном объекте Functions
 */
Function.prototype.pubSub = new PubSub();


/**
 * Определение методов на основе созданного класса в контексте глобальной функции
 */
Function.prototype.subscribe = function(eventName, handler){
    return this.pubSub.subscribe.call(this.pubSub, eventName, handler);
};

Function.prototype.unsubscribe = function(eventName, handler){
    return this.pubSub.unsubscribe.call(this.pubSub, eventName, handler);
};

Function.prototype.publish = function(eventName, data){
    return this.pubSub.publish.call(this.pubSub, eventName, data);
};

Function.prototype.off = function(eventName){
    return this.pubSub.off.call(this.pubSub, eventName);
};

