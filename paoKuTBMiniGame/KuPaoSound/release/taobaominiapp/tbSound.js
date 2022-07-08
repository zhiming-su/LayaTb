var __reflect = function (p, c, t) {
  p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = function __extends(t, e) {
  function r() {
    this.constructor = t;
  }
  for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
  r.prototype = e.prototype, t.prototype = new r();
};
function _tberror(code) {
  throw new Error("#" + code); //使用这种方式报错能够终止后续代码继续运行
}


// function tttbbbthrowit() {
//   throw new Error('');
// }
 
// function tttbbbcatchit() {
//   try {
//     tttbbbthrowit();
//   } catch(e) {
//     // console.log("====== stack ======");
//     console.log(e.stack); // print stack trace
//   }
// }

var ourgame;
ourgame = {};
// ourgame.Event = {};
// ourgame.Event.SOUND_COMPLETE = "soundComplete";


(function (ourgame) {
  /**
   * @private
   * 哈希计数
   */
  ourgame.$hashCount = 1;
  /**
   * The HashObject class is the base class for all objects in the Ourgame1 framework.The HashObject
   * class includes a hashCode property, which is a unique identification number of the instance.
   * @version Ourgame1 2.4
   * @platform Web,Native
   * @language en_US
   */
  /**
   * Ourgame1顶级对象。框架内所有对象的基类，为对象实例提供唯一的hashCode值。
   * @version Ourgame1 2.4
   * @platform Web,Native
   * @language zh_CN
   */
  var HashObject = (function () {
    /**
     * Initializes a HashObject
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 创建一个 HashObject 对象
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    function HashObject() {
      this.$hashCode = ourgame.$hashCount++;
    }
    Object.defineProperty(HashObject.prototype, "hashCode", {
      /**
       * a unique identification number assigned to this instance.
       * @version Ourgame1 2.4
       * @platform Web,Native
       * @language en_US
       */
      /**
       * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
       * @version Ourgame1 2.4
       * @platform Web,Native
       * @language zh_CN
       */
      get: function () {
        return this.$hashCode;
      },
      enumerable: true,
      configurable: true
    });
    return HashObject;
  }());
  ourgame.HashObject = HashObject;
  __reflect(HashObject.prototype, "ourgame.HashObject", ["ourgame.IHashObject"]);
})(ourgame || (ourgame = {}));

(function (ourgame) {
  var ONCE_EVENT_LIST = [];
  /**
   * The EventDispatcher class is the base class for all classes that dispatchEvent events. The EventDispatcher class implements
   * the IEventDispatcher interface and is the base class for the DisplayObject class. The EventDispatcher class allows
   * any object on the display list to be an event target and as such, to use the methods of the IEventDispatcher interface.
   * Event targets are an important part of the Ourgame1 event model. The event target serves as the focal point for how events
   * flow through the display list hierarchy. When an event such as a touch tap, Ourgame1 dispatches an event object into the
   * event flow from the root of the display list. The event object then makes its way through the display list until it
   * reaches the event target, at which point it begins its return trip through the display list. This round-trip journey
   * to the event target is conceptually divided into three phases: <br/>
   * the capture phase comprises the journey from the root to the last node before the event target's node, the target
   * phase comprises only the event target node, and the bubbling phase comprises any subsequent nodes encountered on
   * the return trip to the root of the display list. In general, the easiest way for a user-defined class to gain event
   * dispatching capabilities is to extend EventDispatcher. If this is impossible (that is, if the class is already extending
   * another class), you can instead implement the IEventDispatcher interface, create an EventDispatcher member, and write simple
   * hooks to route calls into the aggregated EventDispatcher.
   * @see ourgame.IEventDispatcher
   * @version Ourgame1 2.4
   * @platform Web,Native
   * @includeExample ourgame/events/EventDispatcher.ts
   * @language en_US
   */
  /**
   * EventDispatcher 是 Ourgame1 的事件派发器类，负责进行事件的发送和侦听。
   * 事件目标是事件如何通过显示列表层次结构这一问题的焦点。当发生鼠标单击、触摸或按键等事件时，
   * 框架会将事件对象调度到从显示列表根开始的事件流中。然后该事件对象在显示列表中前进，直到到达事件目标，
   * 然后从这一点开始其在显示列表中的回程。在概念上，到事件目标的此往返行程被划分为三个阶段：
   * 捕获阶段包括从根到事件目标节点之前的最后一个节点的行程，目标阶段仅包括事件目标节点，冒泡阶段包括回程上遇到的任何后续节点到显示列表的根。
   * 通常，使用户定义的类能够调度事件的最简单方法是扩展 EventDispatcher。如果无法扩展（即，如果该类已经扩展了另一个类），则可以实现
   * IEventDispatcher 接口，创建 EventDispatcher 成员，并编写一些简单的映射，将调用连接到聚合的 EventDispatcher 中。
   * @see ourgame.IEventDispatcher
   * @version Ourgame1 2.4
   * @platform Web,Native
   * @includeExample ourgame/events/EventDispatcher.ts
   * @language zh_CN
   */
  var EventDispatcher = (function (_super) {
    __extends(EventDispatcher, _super);
    /**
     * create an instance of the EventDispatcher class.
     * @param target The target object for events dispatched to the EventDispatcher object. This parameter is used when
     * the EventDispatcher instance is aggregated by a class that implements IEventDispatcher; it is necessary so that the
     * containing object can be the target for events. Do not use this parameter in simple cases in which a class extends EventDispatcher.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 创建一个 EventDispatcher 类的实例
     * @param target 此 EventDispatcher 所抛出事件对象的 target 指向。此参数主要用于一个实现了 IEventDispatcher 接口的自定义类，
     * 以便抛出的事件对象的 target 属性可以指向自定义类自身。请勿在直接继承 EventDispatcher 的情况下使用此参数。
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    function EventDispatcher(target) {
      if (target === void 0) { target = null; }
      var _this = _super.call(this) || this;
      _this.$EventDispatcher = {
        0: target ? target : _this,
        1: {},
        2: {},
        3: 0
      };
      return _this;
    }
    /**
     * @private
     *
     * @param useCapture
     */
    EventDispatcher.prototype.$getEventMap = function (useCapture) {
      var values = this.$EventDispatcher;
      var eventMap = useCapture ? values[2 /* captureEventsMap */] : values[1 /* eventsMap */];
      return eventMap;
    };
    /**
     * @inheritDoc
     * @version Ourgame1 2.4
     * @platform Web,Native
     */
    EventDispatcher.prototype.addEventListener = function (type, listener, thisObject, useCapture, priority) {
      this.$addListener(type, listener, thisObject, useCapture, priority);
    };
    /**
     * @inheritDoc
     * @version Ourgame1 2.4
     * @platform Web,Native
     */
    EventDispatcher.prototype.once = function (type, listener, thisObject, useCapture, priority) {
      this.$addListener(type, listener, thisObject, useCapture, priority, true);
    };
    /**
     * @private
     */
    EventDispatcher.prototype.$addListener = function (type, listener, thisObject, useCapture, priority, dispatchOnce) {
      if (true && !listener) {
        _tberror(1003, "listener");
      }
      var values = this.$EventDispatcher;
      var eventMap = useCapture ? values[2 /* captureEventsMap */] : values[1 /* eventsMap */];
      var list = eventMap[type];
      if (!list) {
        list = eventMap[type] = [];
      }
      else if (values[3 /* notifyLevel */] !== 0) {
        eventMap[type] = list = list.concat();
      }
      this.$insertEventBin(list, type, listener, thisObject, useCapture, priority, dispatchOnce);
    };
    EventDispatcher.prototype.$insertEventBin = function (list, type, listener, thisObject, useCapture, priority, dispatchOnce) {
      priority = +priority | 0;
      var insertIndex = -1;
      var length = list.length;
      for (var i = 0; i < length; i++) {
        var bin = list[i];
        if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
          return false;
        }
        if (insertIndex == -1 && bin.priority < priority) {
          insertIndex = i;
        }
      }
      var eventBin = {
        type: type, listener: listener, thisObject: thisObject, priority: priority,
        target: this, useCapture: useCapture, dispatchOnce: !!dispatchOnce
      };
      if (insertIndex !== -1) {
        list.splice(insertIndex, 0, eventBin);
      }
      else {
        list.push(eventBin);
      }
      return true;
    };
    /**
     * @inheritDoc
     * @version Ourgame1 2.4
     * @platform Web,Native
     */
    EventDispatcher.prototype.removeEventListener = function (type, listener, thisObject, useCapture) {
      var values = this.$EventDispatcher;
      var eventMap = useCapture ? values[2 /* captureEventsMap */] : values[1 /* eventsMap */];
      var list = eventMap[type];
      if (!list) {
        return;
      }
      if (values[3 /* notifyLevel */] !== 0) {
        eventMap[type] = list = list.concat();
      }
      this.$removeEventBin(list, listener, thisObject);
      if (list.length == 0) {
        eventMap[type] = null;
      }
    };
    EventDispatcher.prototype.$removeEventBin = function (list, listener, thisObject) {
      var length = list.length;
      for (var i = 0; i < length; i++) {
        var bin = list[i];
        if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
          list.splice(i, 1);
          return true;
        }
      }
      return false;
    };
    /**
     * @inheritDoc
     * @version Ourgame1 2.4
     * @platform Web,Native
     */
    EventDispatcher.prototype.hasEventListener = function (type) {
      var values = this.$EventDispatcher;
      return !!(values[1 /* eventsMap */][type] || values[2 /* captureEventsMap */][type]);
    };
    /**
     * @inheritDoc
     * @version Ourgame1 2.4
     * @platform Web,Native
     */
    EventDispatcher.prototype.willTrigger = function (type) {
      return this.hasEventListener(type);
    };
    /**
     * @inheritDoc
     * @version Ourgame1 2.4
     * @platform Web,Native
     */
    EventDispatcher.prototype.dispatchEvent = function (event) {
      event.$currentTarget = this.$EventDispatcher[0 /* eventTarget */];
      event.$setTarget(event.$currentTarget);
      return this.$notifyListener(event, false);
    };
    /**
     * @private
     */
    EventDispatcher.prototype.$notifyListener = function (event, capturePhase) {
      var values = this.$EventDispatcher;
      var eventMap = capturePhase ? values[2 /* captureEventsMap */] : values[1 /* eventsMap */];
      var list = eventMap[event.$type];
      if (!list) {
        return true;
      }
      var length = list.length;
      if (length == 0) {
        return true;
      }
      var onceList = ONCE_EVENT_LIST;
      //做个标记，防止外部修改原始数组导致遍历错误。这里不直接调用list.concat()因为dispatch()方法调用通常比on()等方法频繁。
      values[3 /* notifyLevel */]++;
      for (var i = 0; i < length; i++) {
        var eventBin = list[i];
        eventBin.listener.call(eventBin.thisObject, event);
        if (eventBin.dispatchOnce) {
          onceList.push(eventBin);
        }
        if (event.$isPropagationImmediateStopped) {
          break;
        }
      }
      values[3 /* notifyLevel */]--;
      while (onceList.length) {
        var eventBin = onceList.pop();
        eventBin.target.removeEventListener(eventBin.type, eventBin.listener, eventBin.thisObject, eventBin.useCapture);
      }
      return !event.$isDefaultPrevented;
    };
    /**
     * Distribute a specified event parameters.
     * @param type The type of the event. Event listeners can access this information through the inherited type property.
     * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through
     * the inherited bubbles property.
     * @param data {any} data
     * @param cancelable Determines whether the Event object can be canceled. The default values is false.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 派发一个指定参数的事件。
     * @param type {string} 事件类型
     * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
     * @param data {any} 事件data
     * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    EventDispatcher.prototype.dispatchEventWith = function (type, bubbles, data, cancelable) {
      if (bubbles || this.hasEventListener(type)) {
        var event_1 = ourgame.Event.create(ourgame.Event, type, bubbles, cancelable);
        event_1.data = data;
        var result = this.dispatchEvent(event_1);
        ourgame.Event.release(event_1);
        return result;
      }
      return true;
    };
    return EventDispatcher;
  }(ourgame.HashObject));
  ourgame.EventDispatcher = EventDispatcher;
  __reflect(EventDispatcher.prototype, "ourgame.EventDispatcher", ["ourgame.IEventDispatcher"]);
})(ourgame || (ourgame = {}));

(function (ourgame) {
  /**
   * The Event class is used as the base class for the creation of Event objects, which are passed as parameters to event
   * listeners when an event occurs.The properties of the Event class carry basic information about an event, such as
   * the event's type or whether the event's default behavior can be canceled. For many events, such as the events represented
   * by the Event class constants, this basic information is sufficient. Other events, however, may require more detailed
   * information. Events associated with a touch tap, for example, need to include additional information about the
   * location of the touch event. You can pass such additional information to event listeners by extending the Event class,
   * which is what the TouchEvent class does. Ourgame1 API defines several Event subclasses for common events that require
   * additional information. Events associated with each of the Event subclasses are described in the documentation for
   * each class.The methods of the Event class can be used in event listener functions to affect the behavior of the event
   * object. Some events have an associated default behavior. Your event listener can cancel this behavior by calling the
   * preventDefault() method. You can also make the current event listener the last one to process an event by calling
   * the stopPropagation() or stopImmediatePropagation() method.
   * @see ourgame.EventDispatcher
   * @version Ourgame1 2.4
   * @platform Web,Native
   * @includeExample ourgame/events/Event.ts
   * @see http://edn.ourgame.com/cn/docs/page/798 取消触摸事件
   * @language en_US
   */
  /**
   * Event 类作为创建事件实例的基类，当发生事件时，Event 实例将作为参数传递给事件侦听器。Event 类的属性包含有关事件的基本信息，例如事件
   * 的类型或者是否可以取消事件的默认行为。对于许多事件（如由 Event 类常量表示的事件），此基本信息就足够了。但其他事件可能需要更详细的信息。
   * 例如，与触摸关联的事件需要包括有关触摸事件的位置信息。您可以通过扩展 Event 类（TouchEvent 类执行的操作）将此类其他信息传递给事件侦听器。
   * Ourgame1 API 为需要其他信息的常见事件定义多个 Event 子类。与每个 Event 子类关联的事件将在每个类的文档中加以介绍。Event 类的方法可以在
   * 事件侦听器函数中使用以影响事件对象的行为。某些事件有关联的默认行为，通过调用 preventDefault() 方法，您的事件侦听器可以取消此行为。
   * 可以通过调用 stopPropagation() 或 stopImmediatePropagation() 方法，将当前事件侦听器作为处理事件的最后一个事件侦听器。
   * @see ourgame.EventDispatcher
   * @version Ourgame1 2.4
   * @platform Web,Native
   * @includeExample ourgame/events/Event.ts
   * @see http://edn.ourgame.com/cn/docs/page/798 取消触摸事件
   * @language zh_CN
   */
  var Event = (function (_super) {
    __extends(Event, _super);
    /**
     * Creates an Event object to pass as a parameter to event listeners.
     * @param type  The type of the event, accessible as Event.type.
     * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
     * @param cancelable Determines whether the Event object can be canceled. The default values is false.
     * @param data the optional data associated with this event
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 创建一个作为参数传递给事件侦听器的 Event 对象。
     * @param type  事件的类型，可以作为 Event.type 访问。
     * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
     * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
     * @param data 与此事件对象关联的可选数据。
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    function Event(type, bubbles, cancelable, data) {
      var _this = _super.call(this) || this;
      /**
       * @private
       */
      _this.$eventPhase = 2;
      /**
       * @private
       */
      _this.$currentTarget = null;
      /**
       * @private
       */
      _this.$target = null;
      /**
       * @private
       */
      _this.$isDefaultPrevented = false;
      /**
       * @private
       */
      _this.$isPropagationStopped = false;
      /**
       * @private
       */
      _this.$isPropagationImmediateStopped = false;
      _this.$type = type;
      _this.$bubbles = !!bubbles;
      _this.$cancelable = !!cancelable;
      _this.data = data;
      return _this;
    }
    Object.defineProperty(Event.prototype, "type", {
      /**
       * The type of event. The type is case-sensitive.
       * @version Ourgame1 2.4
       * @platform Web,Native
       * @language en_US
       */
      /**
       * 事件的类型。类型区分大小写。
       * @version Ourgame1 2.4
       * @platform Web,Native
       * @language zh_CN
       */
      get: function () {
        return this.$type;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Event.prototype, "bubbles", {
      /**
       * Indicates whether an event is a bubbling event.
       * @version Ourgame1 2.4
       * @platform Web,Native
       * @language en_US
       */
      /**
       * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
       * @version Ourgame1 2.4
       * @platform Web,Native
       * @language zh_CN
       */
      get: function () {
        return this.$bubbles;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Event.prototype, "cancelable", {
      /**
       * Indicates whether the behavior associated with the event can be prevented. If the behavior can be
       * canceled, this value is true; otherwise it is false.
       * @see #preventDefault()
       * @version Ourgame1 2.4
       * @platform Web,Native
       * @language en_US
       */
      /**
       * 表示是否可以阻止与事件相关联的行为。如果可以取消该行为，则此值为 true；否则为 false。
       * @see #preventDefault()
       * @version Ourgame1 2.4
       * @platform Web,Native
       * @language zh_CN
       */
      get: function () {
        return this.$cancelable;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Event.prototype, "eventPhase", {
      /**
       * The current phase in the event flow. This property can contain the following numeric values:
       * The capture phase (EventPhase.CAPTURING_PHASE).
       * The target phase (EventPhase.AT_TARGET)
       * The bubbling phase (EventPhase.BUBBLING_PHASE).
       * @see ourgame.EventPhase
       * @version Ourgame1 2.4
       * @platform Web,Native
       * @language en_US
       */
      /**
       * 事件流中的当前阶段。此属性可以包含以下数值：
       * 捕获阶段 (EventPhase.CAPTURING_PHASE)。
       * 目标阶段 (EventPhase.AT_TARGET)。
       * 冒泡阶段 (EventPhase.BUBBLING_PHASE)。
       * @see ourgame.EventPhase
       * @version Ourgame1 2.4
       * @platform Web,Native
       * @language zh_CN
       */
      get: function () {
        return this.$eventPhase;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Event.prototype, "currentTarget", {
      /**
       * The object that is actively processing the Event object with an event listener. For example, if a
       * user clicks an OK button, the current target could be the node containing that button or one of its ancestors
       * that has registered an event listener for that event.
       * @version Ourgame1 2.4
       * @platform Web,Native
       * @language en_US
       */
      /**
       * 当前正在使用某个事件侦听器处理 Event 对象的对象。例如，如果用户单击“确定”按钮，
       * 则当前目标可以是包含该按钮的节点，也可以是它的已为该事件注册了事件侦听器的始祖之一。
       * @version Ourgame1 2.4
       * @platform Web,Native
       * @language zh_CN
       */
      get: function () {
        return this.$currentTarget;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Event.prototype, "target", {
      /**
       * The event target. This property contains the target node. For example, if a user clicks an OK button,
       * the target node is the display list node containing that button.
       * @version Ourgame1 2.4
       * @platform Web,Native
       * @language en_US
       */
      /**
       * 事件目标。此属性包含目标节点。例如，如果用户单击“确定”按钮，则目标节点就是包含该按钮的显示列表节点。
       * @version Ourgame1 2.4
       * @platform Web,Native
       * @language zh_CN
       */
      get: function () {
        return this.$target;
      },
      enumerable: true,
      configurable: true
    });
    Event.prototype.$setTarget = function (target) {
      this.$target = target;
      return true;
    };
    /**
     * Checks whether the preventDefault() method has been called on the event. If the preventDefault() method has been
     * called, returns true; otherwise, returns false.
     * @returns If preventDefault() has been called, returns true; otherwise, returns false.
     * @see #preventDefault()
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 检查是否已对事件调用 preventDefault() 方法。
     * @returns 如果已调用 preventDefault() 方法，则返回 true；否则返回 false。
     * @see #preventDefault()
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.prototype.isDefaultPrevented = function () {
      return this.$isDefaultPrevented;
    };
    /**
     * Cancels an event's default behavior if that behavior can be canceled.Many events have associated behaviors that
     * are carried out by default. For example, if a user types a character into a text input, the default behavior
     * is that the character is displayed in the text input. Because the TextEvent.TEXT_INPUT event's default behavior
     * can be canceled, you can use the preventDefault() method to prevent the character from appearing.
     * You can use the Event.cancelable property to check whether you can prevent the default behavior associated with
     * a particular event. If the value of Event.cancelable is true, then preventDefault() can be used to cancel the event;
     * otherwise, preventDefault() has no effect.
     * @see #cancelable
     * @see #isDefaultPrevented
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 如果可以取消事件的默认行为，则取消该行为。
     * 许多事件都有默认执行的关联行为。例如，如果用户在文本字段中键入一个字符，则默认行为就是在文本字段中显示该字符。
     * 由于可以取消 TextEvent.TEXT_INPUT 事件的默认行为，因此您可以使用 preventDefault() 方法来防止显示该字符。
     * 您可以使用 Event.cancelable 属性来检查是否可以防止与特定事件关联的默认行为。如果 Event.cancelable 的值为 true，
     * 则可以使用 preventDefault() 来取消事件；否则，preventDefault() 无效。
     * @see #cancelable
     * @see #isDefaultPrevented
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.prototype.preventDefault = function () {
      if (this.$cancelable)
        this.$isDefaultPrevented = true;
    };
    /**
     * Prevents processing of any event listeners in nodes subsequent to the current node in the event flow. This method
     * does not affect any event listeners in the current node (currentTarget). In contrast, the stopImmediatePropagation()
     * method prevents processing of event listeners in both the current node and subsequent nodes. Additional calls to this
     * method have no effect. This method can be called in any phase of the event flow.<br/>
     * Note: This method does not cancel the behavior associated with this event; see preventDefault() for that functionality.
     * @see #stopImmediatePropagation()
     * @see #preventDefault()
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。此方法不会影响当前节点 currentTarget 中的任何事件侦听器。
     * 相比之下，stopImmediatePropagation() 方法可以防止对当前节点中和后续节点中的事件侦听器进行处理。
     * 对此方法的其它调用没有任何效果。可以在事件流的任何阶段中调用此方法。<br/>
     * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
     * @see #stopImmediatePropagation()
     * @see #preventDefault()
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.prototype.stopPropagation = function () {
      if (this.$bubbles)
        this.$isPropagationStopped = true;
    };
    /**
     * Prevents processing of any event listeners in the current node and any subsequent nodes in the event flow.
     * This method takes effect immediately, and it affects event listeners in the current node. In contrast, the
     * stopPropagation() method doesn't take effect until all the event listeners in the current node finish processing.<br/>
     * Note: This method does not cancel the behavior associated with this event; see preventDefault() for that functionality.
     * @see #stopPropagation()
     * @see #preventDefault()
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。此方法会立即生效，并且会影响当前节点中的事件侦听器。
     * 相比之下，在当前节点中的所有事件侦听器都完成处理之前，stopPropagation() 方法不会生效。<br/>
     * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
     * @see #stopPropagation()
     * @see #preventDefault()
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.prototype.stopImmediatePropagation = function () {
      if (this.$bubbles)
        this.$isPropagationImmediateStopped = true;
    };
    /**
     * This method will be called automatically when you pass the event object as the parameters to the Event.release() method.
     * If your custom event is designed for reusable,you should override this method to make sure all the references to external
     * objects are cleaned. if not,it may cause memory leaking.
     * @see ourgame.Event.create()
     * @see ourgame.Event.release()
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 当事件实例传递给Event.release()静态方法时，实例上的clean()方法将会被自动调用。
     * 若此自定义事件的实例设计为可以循环复用的，为了避免引起内存泄露，自定义事件需要覆盖此方法来确保实例被缓存前断开对外部对象的一切引用。
     * @see ourgame.Event.create()
     * @see ourgame.Event.release()
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.prototype.clean = function () {
      this.data = this.$currentTarget = null;
      this.$setTarget(null);
    };
    /**
     * EventDispatcher object using the specified event object thrown Event. Objects thrown objects will be cached in the pool for the next round robin.
     * @param target the event target
     * @param type The type of the event. Event listeners can access this information through the inherited type property.
     * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through
     * the inherited bubbles property.
     * @param data {any} data
     * @method ourgame.Event.dispatchEvent
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 使用指定的 EventDispatcher 对象来抛出 Event 事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
     * @param target {ourgame.IEventDispatcher} 派发事件目标
     * @param type {string} 事件类型
     * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
     * @param data {any} 事件data
     * @method ourgame.Event.dispatchEvent
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.dispatchEvent = function (target, type, bubbles, data) {
      if (bubbles === void 0) { bubbles = false; }
      var event = Event.create(Event, type, bubbles);
      var props = Event._getPropertyData(Event);
      if (data != undefined) {
        props.data = data;
      }
      var result = target.dispatchEvent(event);
      Event.release(event);
      return result;
    };
    /**
     * @private
     *
     * @param EventClass
     * @returns
     */
    Event._getPropertyData = function (EventClass) {
      var props = EventClass._props;
      if (!props)
        props = EventClass._props = {};
      return props;
    };
    /**
     * Gets one event instance from the object pool or create a new one. We highly recommend using the Event.create()
     * and Event.release() methods to create and release an event object,it can reduce the number of reallocate objects,
     * which allows you to get better code execution performance.<br/>
     * Note: If you want to use this method to initialize your custom event object,you must make sure the constructor
     * of your custom event is the same as the constructor of ourgame.Event.
     * @param EventClass Event Class。
     * @param type  The type of the event, accessible as Event.type.
     * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
     * @param cancelable Determines whether the Event object can be canceled. The default values is false.
     * @example
     * <pre>
     *    let event = Event.create(Event,type, bubbles);
     *    event.data = data;    //optional,initializes custom data here
     *    this.dispatchEvent(event);
     *    Event.release(event);
     * </pre>
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 从对象池中取出或创建一个新的事件实例。我们建议您尽可能使用Event.create()和Event.release() 这一对方法来创建和释放事件对象，
     * 这一对方法会将事件实例在内部缓存下来供下次循环使用，减少对象的创建次数,从而获得更高的代码运行性能。<br/>
     * 注意：若使用此方法来创建自定义事件的实例，自定义的构造函数参数列表必须跟Event类一致。
     * @param EventClass Event类名。
     * @param type  事件的类型，可以作为 Event.type 访问。
     * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
     * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
     * @example
     * <pre>
     *    let event = Event.create(Event,type, bubbles);
     *    event.data = data;  //可选，若指定义事件上需要附加其他参数，可以在获取实例后在此处设置。
     *    this.dispatchEvent(event);
     *    Event.release(event);
     * </pre>
     * @see #clean()
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.create = function (EventClass, type, bubbles, cancelable) {
      var eventPool;
      var hasEventPool = EventClass.hasOwnProperty("eventPool");
      if (hasEventPool) {
        eventPool = EventClass.eventPool;
      }
      if (!eventPool) {
        eventPool = EventClass.eventPool = [];
      }
      if (eventPool.length) {
        var event_2 = eventPool.pop();
        event_2.$type = type;
        event_2.$bubbles = !!bubbles;
        event_2.$cancelable = !!cancelable;
        event_2.$isDefaultPrevented = false;
        event_2.$isPropagationStopped = false;
        event_2.$isPropagationImmediateStopped = false;
        event_2.$eventPhase = 2 /* AT_TARGET */;
        return event_2;
      }
      return new EventClass(type, bubbles, cancelable);
    };
    /**
     * Releases an event object and cache it into the object pool.We highly recommend using the Event.create()
     * and Event.release() methods to create and release an event object,it can reduce the number of reallocate objects,
     * which allows you to get better code execution performance.<br/>
     * Note: The parameters of this method only accepts an instance created by the Event.create() method.
     * if not,it may throw an error.
     * @example
     * <pre>
     *    let event = Event.create(Event,type, bubbles);
     *    event.data = data; //optional,initializes custom data here
     *    this.dispatchEvent(event);
     *    Event.release(event);
     * </pre>
     * @see #clean()
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 释放一个事件对象，并缓存到对象池。我们建议您尽可能使用Event.create()和Event.release() 这一对方法来创建和释放事件对象，
     * 这一对方法会将事件实例在内部缓存下来供下次循环使用，减少对象的创建次数,从而获得更高的代码运行性能。<br/>
     * 注意：此方法只能传入由Event.create()创建的事件实例，传入非法对象实例可能会导致报错。
     * @example
     * <pre>
     *    let event = Event.create(Event,type, bubbles);
     *    event.data = data;   //可选，若指定义事件上需要附加其他参数，可以在获取实例后在此处设置。
     *    this.dispatchEvent(event);
     *    Event.release(event);
     * </pre>
     * @see #clean()
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.release = function (event) {
      event.clean();
      var EventClass = Object.getPrototypeOf(event).constructor;
      EventClass.eventPool.push(event);
    };
    /**
     * Dispatched when a display object is added to the on stage display list, either directly or through the addition
     * of a sub tree in which the display object is contained.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.ADDED_TO_STAGE = "addedToStage";
    /**
     * Dispatched when a display object is about to be removed from the display list, either directly or through the removal
     * of a sub tree in which the display object is contained.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.REMOVED_FROM_STAGE = "removedFromStage";
    /**
     * Dispatched when a display object is added to the display list.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 将显示对象添加到显示列表中时调度。
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.ADDED = "added";
    /**
     * Dispatched when a display object is about to be removed from the display list.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 将要从显示列表中删除显示对象时调度。
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.REMOVED = "removed";
    /**
     * [broadcast event] Dispatched when the playhead is entering a new frame.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * [广播事件] 进入新的一帧,监听此事件将会在下一帧开始时触发一次回调。这是一个广播事件，可以在任何一个显示对象上监听，无论它是否在显示列表中。
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.ENTER_FRAME = "enterFrame";
    /**
     * Dispatched when the display list is about to be updated and rendered.
     * Note: Every time you want to receive a render event,you must call the stage.invalidate() method.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 渲染事件，监听此事件将会在本帧末即将开始渲染的前一刻触发回调，这是一个广播事件，可以在任何一个显示对象上监听，无论它是否在显示列表中。
     * 注意：每次您希望 Ourgame1 发送 Event.RENDER 事件时，都必须调用 stage.invalidate() 方法，由于每帧只会触发一次屏幕刷新，
     * 若在 Event.RENDER 回调函数执行期间再次调用stage.invalidate()，将会被忽略。
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.RENDER = "render";
    /**
     * Dispatched when the size of stage or UIComponent is changed.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 舞台尺寸或UI组件尺寸发生改变
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.RESIZE = "resize";
    /**
     * Dispatched when the value or selection of a property is chaned.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 属性值或状态发生改变。通常是按钮的选中状态，或者列表的选中项索引改变。
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.CHANGE = "change";
    /**
     * Dispatched when the value or selection of a property is going to change.you can cancel this by calling the
     * preventDefault() method.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 属性值或状态即将发生改变,通常是按钮的选中状态，或者列表的选中项索引改变。可以通过调用 preventDefault() 方法阻止索引发生更改。
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.CHANGING = "changing";
    /**
     * Dispatched when the net request is complete.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 网络请求加载完成
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.COMPLETE = "complete";
    /**
     * Dispatched when loop completed.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 循环完成。循环最后一次只派发 COMPLETE 事件，不派发 LOOP_COMPLETE 事件。
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.LOOP_COMPLETE = "loopComplete";
    /**
     * Dispatched when the TextInput instance gets focus.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * TextInput实例获得焦点
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.FOCUS_IN = "focusIn";
    /**
     * Dispatched when the TextInput instance loses focus.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * TextInput实例失去焦点
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.FOCUS_OUT = "focusOut";
    /**
     * Dispatched when the playback is ended.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 动画声音等播放完成
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    Event.ENDED = "ended";
    /**
     * 游戏激活
     * @version Ourgame1 2.4
     * @platform Web,Native
     */
    Event.ACTIVATE = "activate";
    /**
     * 取消激活
     * @version Ourgame1 2.4
     * @platform Web,Native
     */
    Event.DEACTIVATE = "deactivate";
    /**
     * Event.CLOSE 常量定义 close 事件对象的 type 属性的值。
     * @version Ourgame1 2.4
     * @platform Web,Native
     */
    Event.CLOSE = "close";
    /**
     * Event.CONNECT 常量定义 connect 事件对象的 type 属性的值。
     * @version Ourgame1 2.4
     * @platform Web,Native
     */
    Event.CONNECT = "connect";
    /**
     * Event.LEAVE_STAGE 常量定义 leaveStage 事件对象的 type 属性的值。
     * @version Ourgame1 2.4
     * @platform Web,Native
     */
    Event.LEAVE_STAGE = "leaveStage";
    /**
     * Event.SOUND_COMPLETE 常量定义 在声音完成播放后调度。
     * @version Ourgame1 2.4
     * @platform Web,Native
     */
    Event.SOUND_COMPLETE = "soundComplete";
    return Event;
  }(ourgame.HashObject));
  ourgame.Event = Event;
  __reflect(Event.prototype, "ourgame.Event");
})(ourgame || (ourgame = {}));

(function (ourgame) {
  /**
   * @classdesc IO流事件，当错误导致输入或输出操作失败时调度 IOErrorEvent 对象。
   * @version Ourgame1 2.4
   * @platform Web,Native
   * @includeExample ourgame/events/IOErrorEvent.ts
   * @language en_US
   */
  /**
   * @classdesc IO流事件，当错误导致输入或输出操作失败时调度 IOErrorEvent 对象。
   * @version Ourgame1 2.4
   * @platform Web,Native
   * @includeExample ourgame/events/IOErrorEvent.ts
   * @language zh_CN
   */
  var IOErrorEvent = (function (_super) {
    __extends(IOErrorEvent, _super);
    /**
     * Create a ourgame.IOErrorEvent objects
     * @param type {string} Type of event, accessible as Event.type.
     * @param bubbles {boolean} Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
     * @param cancelable {boolean} Determine whether the Event object can be canceled. The default value is false.
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 创建一个 ourgame.IOErrorEvent 对象
     * @param type {string} 事件的类型，可以作为 Event.type 访问。
     * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
     * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    function IOErrorEvent(type, bubbles, cancelable) {
      if (bubbles === void 0) { bubbles = false; }
      if (cancelable === void 0) { cancelable = false; }
      return _super.call(this, type, bubbles, cancelable) || this;
    }
    /**
     * EventDispatcher object using the specified event object thrown Event. The objects will be thrown in the object cache pool for the next round robin.
     * @param target {ourgame.IEventDispatcher} Distribute event target
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
     * @param target {ourgame.IEventDispatcher} 派发事件目标
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    IOErrorEvent.dispatchIOErrorEvent = function (target) {
      var event = ourgame.Event.create(IOErrorEvent, IOErrorEvent.IO_ERROR);
      var result = target.dispatchEvent(event);
      ourgame.Event.release(event);
      return result;
    };
    /**
     * io error
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * io发生错误
     * @version Ourgame1 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    IOErrorEvent.IO_ERROR = "ioError";
    return IOErrorEvent;
  }(ourgame.Event));
  ourgame.IOErrorEvent = IOErrorEvent;
  __reflect(IOErrorEvent.prototype, "ourgame.IOErrorEvent");
})(ourgame || (ourgame = {}));

(function (ourgame) {
  var mygame;
  (function (mygame) {
    var HtmlSoundChannel = (function (_super) {
      __extends(HtmlSoundChannel, _super);
      function HtmlSoundChannel(audio) {
        var _this = _super.call(this) || this;
        _this.$startTime = 0;
        _this.audio = null;
        _this.isStopped = false;
        _this.onPlayEnd = function () {
          // console.log("====== onPlayEnd : ", _this.$url, _this.$loops);
          if (_this.$loops == 1) {
            _this.stop();
            _this.dispatchEventWith(ourgame.Event.SOUND_COMPLETE);
            return;
          }
          if (_this.$loops > 0) {
            _this.$loops--;
          }
          _this.audio.pause();
          // console.log("=== onPlayEnd audio.pause:", _this.$url);
          _this.audio.offEnded(_this.onPlayEnd);
          _this.$play();
        };
        _this._volume = 1;
        _this.audio = audio;
        return _this;
      }
      HtmlSoundChannel.prototype.$play = function () {
        if (this.isStopped) {
          _tberror(1036);
          return;
        }
        this.audio.onEnded(this.onPlayEnd);
        this.audio.volume = this._volume;
        this.audio.seek(this.$startTime);
        this.audio.play();
      };
      HtmlSoundChannel.prototype.stop = function () {
        if (!this.audio)
          return;
        this.isStopped = true;
        // console.log("=== HtmlSoundChannel stop pause:", this.$url);
        this.audio.pause();
        this.audio.offEnded(this.onPlayEnd);
      };
      Object.defineProperty(HtmlSoundChannel.prototype, "volume", {
        get: function () {
          return this._volume;
        },
        set: function (value) {
          if (this.isStopped) {
            _tberror(1036);
            return;
          }
          this._volume = value;
          if (!this.audio)
            return;
          this.audio.volume = value;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(HtmlSoundChannel.prototype, "position", {
        get: function () {
          if (!this.audio)
            return 0;
          return this.audio.currentTime;
        },
        enumerable: true,
        configurable: true
      });
      return HtmlSoundChannel;
    }(ourgame.EventDispatcher));
    mygame.HtmlSoundChannel = HtmlSoundChannel;
    __reflect(HtmlSoundChannel.prototype, "ourgame.mygame.HtmlSoundChannel", ["ourgame.SoundChannel", "ourgame.IEventDispatcher"]);
  })(mygame = ourgame.mygame || (ourgame.mygame = {}));
})(ourgame || (ourgame = {}));

(function (ourgame) {
  var mygame;
  (function (mygame) {
    var HtmlSound = (function (_super) {
      __extends(HtmlSound, _super);
      function HtmlSound() {
        // console.log("======== HtmlSound 1", this.hashCode);
        var _this = _super.call(this) || this;
        // console.log("======== HtmlSound 2", _this.hashCode);
        _this.loaded = false;
        // console.log("======== HtmlSound 3", _this.hashCode);
        _this.tttflag = 0;
        return _this;
      }
      Object.defineProperty(HtmlSound.prototype, "length", {
        get: function () {
          if (this.originAudio) {
            return this.originAudio.duration;
          }
          throw new Error("sound not loaded!");
        },
        enumerable: true,
        configurable: true
      });
      HtmlSound.prototype.load = function (url) {
        var _this = this;
        var self = this;
        this.url = url;
        if (true && !url) {
          _tberror(3002);
        }
        var audio = my.createInnerAudioContext();
        audio.autoplay = true;
        audio.src = "/pages/index/" + url;
        audio.volume = 0;
        this.originAudio = audio;
        var idx = setInterval(function () {
          if (audio.duration && audio.duration > 0.1) {
            clearInterval(idx);
            audio.pause();
            // console.log("=== setInterval audio.pause:", url);
            audio.seek(0);
            audio.volume = 1;
            _this.loaded = true;
            _this.dispatchEventWith(ourgame.Event.COMPLETE);
          }
        }, 200);
        audio.onError(function (res) {
          // console.log('audio error:', url, res);
          self.dispatchEventWith(ourgame.IOErrorEvent.IO_ERROR);
        });
        audio.onPlay(() => {
				  // console.log("onPlay:", url);
				})
				audio.onEnded(() => {
				  // console.log("onEnded:", url)
				});
				audio.onPause(() => {
          // console.log("onPause:", url)
				});
				audio.onStop(() => {
				  // console.log("onStop:", url)
				})
      };
      HtmlSound.prototype.play = function (startTime, loops) {
        startTime = +startTime || 0;
        loops = +loops || 0;
        if (true && this.loaded == false) {
          _tberror(1049);
        }
        var channel = new mygame.HtmlSoundChannel(this.originAudio);
        channel.$url = this.url;
        channel.$loops = loops;
        channel.$startTime = startTime;
        channel.$play();
        return channel;
      };
      HtmlSound.prototype.close = function () {
        if (this.originAudio) {
          this.originAudio.destroy();
          this.originAudio = null;
        }
        this.loaded = false;
      };
      HtmlSound.MUSIC = "music";
      HtmlSound.EFFECT = "effect";
      return HtmlSound;
    }(ourgame.EventDispatcher));
    mygame.HtmlSound = HtmlSound;
    __reflect(HtmlSound.prototype, "ourgame.mygame.HtmlSound", ["ourgame.Sound"]);
  })(mygame = ourgame.mygame || (ourgame.mygame = {}));
})(ourgame || (ourgame = {}));

(function (ourgame) {
  var mygame;
  (function (mygame) {
    var AudioType = (function () {
      function AudioType() {
      }
      AudioType.WEB_AUDIO = 2;
      AudioType.HTML5_AUDIO = 3;
      return AudioType;
    }());
    mygame.AudioType = AudioType;
    __reflect(AudioType.prototype, "ourgame.mygame.AudioType");
    var Html5Capatibility = (function (_super) {
      __extends(Html5Capatibility, _super);
      function Html5Capatibility() {
        return _super.call(this) || this;
      }
      Html5Capatibility.$init = function () {
        var systemInfo = my.getSystemInfoSync();
        Html5Capatibility.systemInfo = systemInfo;
        ourgame.Sound = mygame.HtmlSound;
      };
      Html5Capatibility._canUseBlob = false;
      Html5Capatibility._audioType = 0;
      return Html5Capatibility;
    }(ourgame.HashObject));
    mygame.Html5Capatibility = Html5Capatibility;
    __reflect(Html5Capatibility.prototype, "ourgame.mygame.Html5Capatibility");
    var currentPrefix = null;
    function getPrefixStyleName(name, element) {
      var header = "";
      if (element != null) {
        header = getPrefix(name, element);
      }
      else {
        if (currentPrefix == null) {
          var tempStyle = document.createElement('div').style;
          currentPrefix = getPrefix("transform", tempStyle);
        }
        header = currentPrefix;
      }
      if (header == "") {
        return name;
      }
      return header + name.charAt(0).toUpperCase() + name.substring(1, name.length);
    }
    mygame.getPrefixStyleName = getPrefixStyleName;
    function getPrefix(name, element) {
      if (name in element) {
        return "";
      }
      name = name.charAt(0).toUpperCase() + name.substring(1, name.length);
      var transArr = ["webkit", "ms", "Moz", "O"];
      for (var i = 0; i < transArr.length; i++) {
        var tempStyle = transArr[i] + name;
        if (tempStyle in element) {
          return transArr[i];
        }
      }
      return "";
    }
    mygame.getPrefix = getPrefix;
  })(mygame = ourgame.mygame || (ourgame.mygame = {}));
})(ourgame || (ourgame = {}));

(function (ourgame) {
    /**
     * Type of operation.
     * @version ourgame 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 运行类型的类型。
     * @version ourgame 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    var RuntimeType;
    (function (RuntimeType) {
        /**
         * Running on Web
         * @version ourgame 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 运行在Web上
         * @version ourgame 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        RuntimeType.WEB = "web";
        /**
         * Running on NATIVE
         * @version ourgame 2.4
         * @deprecated
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 运行在NATIVE上
         * @version ourgame 2.4
         * @deprecated
         * @platform Web,Native
         * @language zh_CN
         */
        RuntimeType.NATIVE = "native";
        /**
         * Running on Runtime2.0
         * @version ourgame 5.1.5
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 运行在Runtime2.0上
         * @version ourgame 5.1.5
         * @platform Web,Native
         * @language zh_CN
         */
        RuntimeType.RUNTIME2 = "runtime2";
        /**
         * Running on Alipay
         * @version ourgame 5.2.33
         * @platform All
         * @language en_US
         */
        /**
         * 运行在支付宝小游戏上
         * @version ourgame 5.2.33
         * @platform All
         * @language zh_CN
         */
        RuntimeType.MYGAME = "mygame";
        /**
         * Running on WeChat mini game
         * @version ourgame 5.1.5
         * @platform All
         * @language en_US
         */
        /**
         * 运行在微信小游戏上
         * @version ourgame 5.1.5
         * @platform All
         * @language zh_CN
         */
        RuntimeType.WXGAME = "wxgame";
        /**
         * Running on Baidu mini game
         * @version ourgame 5.2.13
         * @platform All
         * @language en_US
         */
        /**
         * 运行在百度小游戏上
         * @version ourgame 5.2.13
         * @platform All
         * @language zh_CN
         */
        RuntimeType.BAIDUGAME = "baidugame";
        /**
         * Running on Xiaomi quick game
         * @version ourgame 5.2.14
         * @platform All
         * @language en_US
         */
        /**
         * 运行在小米快游戏上
         * @version ourgame 5.2.14
         * @platform All
         * @language zh_CN
         */
        RuntimeType.QGAME = "qgame";
        /**
         * Running on OPPO mini game
         * @version ourgame 5.2.14
         * @platform All
         * @language en_US
         */
        /**
         * 运行在 Oppo 小游戏上
         * @version ourgame 5.2.14
         * @platform All
         * @language zh_CN
         */
        RuntimeType.OPPOGAME = "oppogame";
        /**
        * Running on QQ mini game
        * @version ourgame 5.2.25
        * @platform All
        * @language en_US
        */
        /**
        * 运行在 QQ 小游戏上
        * @version ourgame 5.2.25
        * @platform All
        * @language zh_CN
        */
        RuntimeType.QQGAME = "qqgame";
        /**
         * Running on vivo mini game
         * @version ourgame 5.2.23
         * @platform All
         * @language en_US
         */
        /**
        * 运行在 vivo 小游戏上
        * @version ourgame 5.2.23
        * @platform All
        * @language zh_CN
        */
        RuntimeType.VIVOGAME = "vivogame";
        /**
         * Running on 360 mini game
         * @version ourgame 5.3.5
         * @platform All
         * @language en_US
         */
        /**
        * 运行在 360 小游戏上
        * @version ourgame 5.3.5
        * @platform All
        * @language zh_CN
        */
        RuntimeType.QHGAME = "qhgame";
        /**
         * Running on bytedance mini game
         * @version ourgame 5.3.8
         * @platform All
         * @language en_US
         */
        /**
        * 运行在字节跳动小游戏上
        * @version ourgame 5.3.8
        * @platform All
        * @language zh_CN
        */
        RuntimeType.TTGAME = "ttgame";
        /**
         * Running on huawei fastgame
         * @version ourgame 5.3.9
         * @platform All
         * @language en_US
         */
        /**
        * 运行在华为快游戏上
        * @version ourgame 5.3.9
        * @platform All
        * @language zh_CN
        */
        RuntimeType.FASTGAME = "fastgame";
        /**
        * Running on taobao creative app
        * @version ourgame 5.3.10
        * @platform All
        * @language en_US
        */
        /**
        * 运行在淘宝创意互动上
        * @version ourgame 5.3.10
        * @platform All
        * @language zh_CN
        */
        RuntimeType.TBCREATIVEAPP = "tbcreativeapp";
    })(RuntimeType = ourgame.RuntimeType || (ourgame.RuntimeType = {}));
    /**
     * The Capabilities class provides properties that describe the system and runtime that are hosting the application.
     * @version ourgame 2.4
     * @platform Web,Native
     * @includeExample ourgame/system/Capabilities.ts
     * @language en_US
     */
    /**
     * Capabilities 类提供一些属性，这些属性描述了承载应用程序的系统和运行时。
     * @version ourgame 2.4
     * @platform Web,Native
     * @includeExample ourgame/system/Capabilities.ts
     * @language zh_CN
     */
    var Capabilities = (function () {
        function Capabilities() {
        }
        Object.defineProperty(Capabilities, "supportedCompressedTexture", {
            get: function () {
                if (this._supportedCompressedTexture && this._supportedCompressedTexture.pvrtc != undefined && this._supportedCompressedTexture != undefined) {
                    return this._supportedCompressedTexture;
                }
                else {
                    // 只有 native 环境
                    ourgame['web'] ? ourgame['web'].WebGLRenderContext.getInstance().getSupportedCompressedTexture() : null;
                    return this._supportedCompressedTexture;
                }
            },
            enumerable: true,
            configurable: true
        });
        ;
        /**
         * Specifies the language code of the system on which the content is running. The language is specified as a lowercase
         * two-letter language code from ISO 639-1. For Chinese, an additional uppercase two-letter country code from ISO 3166
         * distinguishes between Simplified and Traditional Chinese.<br/>
         * The following table lists the possible values,but not limited to them:
         * <ul>
         * <li>Simplified    Chinese  zh-CN</li>
         * <li>Traditional   Chinese  zh-TW</li>
         * <li>English       en</li>
         * <li>Japanese      ja</li>
         * <li>Korean        ko</li>
         * </ul>
         * @version ourgame 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示运行内容的系统的语言代码。语言指定为 ISO 639-1 中的小写双字母语言代码。
         * 对于中文，另外使用 ISO 3166 中的大写双字母国家/地区代码，以区分简体中文和繁体中文。<br/>
         * 以下是可能但不限于的语言和值：
         * <ul>
         * <li>简体中文  zh-CN</li>
         * <li>繁体中文  zh-TW</li>
         * <li>英语      en</li>
         * <li>日语      ja</li>
         * <li>韩语      ko</li>
         * </ul>
         * @version ourgame 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        Capabilities.language = "zh-CN";
        /**
         * Specifies the current operating system. The os property can return the following strings:
         * <ul>
         * <li>iPhone            "iOS"</li>
         * <li>Android Phone     "Android"</li>
         * <li>Windows Phone     "Windows Phone"</li>
         * <li>Windows Desktop   "Windows PC"</li>
         * <li>Mac Desktop       "Mac OS"</li>
         * <li>Unknown OS        "Unknown"</li>
         * </ul>
         * @version ourgame 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指示当前的操作系统。os 属性返回下列字符串：
         * <ul>
         * <li>苹果手机操作系统     "iOS"</li>
         * <li>安卓手机操作系统     "Android"</li>
         * <li>微软手机操作系统     "Windows Phone"</li>
         * <li>微软桌面操作系统     "Windows PC"</li>
         * <li>苹果桌面操作系统     "Mac OS"</li>
         * <li>未知操作系统        "Unknown"</li>
         * </ul>
         * @version ourgame 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        Capabilities.os = "Unknown";
        /**
         * It indicates the current type of operation. runtimeType property returns the following string:
         * <ul>
         * <li>Run on Web     ourgame.RuntimeType.WEB</li>
         * <li>Run on Runtime2.0     ourgame.RuntimeType.RUNTIME2</li>
         * <li>Run on WeChat mini game     ourgame.RuntimeType.WXGAME</li>
         * </ul>
         * @version ourgame 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指示当前的运行类型。runtimeType 属性返回下列字符串：
         * <ul>
         * <li>运行在Web上     ourgame.RuntimeType.WEB</li>
         * <li>运行在Runtime2.0上     ourgame.RuntimeType.RUNTIME2</li>
         * <li>运行在微信小游戏上    ourgame.RuntimeType.WXGAME</li>
         * </ul>
         * @version ourgame 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        Capabilities.runtimeType = ourgame.RuntimeType.WEB;
        /***
         * version of ourgame.
         * @type {string}
         * @version ourgame 3.2.0
         * @platform Web,Native
         * @language en_US
         */
        /***
         * ourgame 的版本号。
         * @type {string}
         * @version ourgame 3.2.0
         * @platform Web,Native
         * @language zh_CN
         */
        Capabilities.engineVersion = "5.4.0";
        /***
         * current render mode.
         * @type {string}
         * @version ourgame 3.0.7
         * @platform Web,Native
         * @language en_US
         */
        /***
         * 当前渲染模式。
         * @type {string}
         * @version ourgame 3.0.7
         * @platform Web,Native
         * @language zh_CN
         */
        Capabilities.renderMode = "Unknown";
        /***
         * Clients border width.
         * The value before the document class initialization is always 0.
         * This value will change after the distribution Event.RESIZE and StageOrientationEvent.ORIENTATION_CHANGE.
         * @version ourgame 3.1.3
         * @platform Web,Native
         * @language en_US
         */
        /***
         * 客户端边界宽度。
         * 该值在文档类初始化之前始终是0。
         * 该值在派发 Event.RESIZE 以及 StageOrientationEvent.ORIENTATION_CHANGE 之后会发生改变。
         * @version ourgame 3.1.3
         * @platform Web,Native
         * @language zh_CN
         */
        Capabilities.boundingClientWidth = 0;
        /***
         * Clients border height.
         * The value before the document class initialization is always 0.
         * This value will change after the distribution Event.RESIZE and StageOrientationEvent.ORIENTATION_CHANGE.
         * @version ourgame 3.1.3
         * @platform Web,Native
         * @language en_US
         */
        /***
         * 客户端边界高度。
         * 该值在文档类初始化之前始终是0。
         * 该值在派发 Event.RESIZE 以及 StageOrientationEvent.ORIENTATION_CHANGE 之后会发生改变。
         * @version ourgame 3.1.3
         * @platform Web,Native
         * @language zh_CN
         */
        Capabilities.boundingClientHeight = 0;
        /***
         * supported compressed texture
         * @version ourgame 5.2.19
         * @platform Web,Native
         * @language en_US
         */
        /***
         * supported compressed texture
         * @version ourgame 5.2.19
         * @platform Web,Native
         * @language zh_CN
         */
        Capabilities._supportedCompressedTexture = {};
        return Capabilities;
    }());
    ourgame.Capabilities = Capabilities;
    __reflect(Capabilities.prototype, "ourgame.Capabilities");
})(ourgame || (ourgame = {}));

(function (ourgame) {
    var mygame;
    (function (mygame) {
        mygame.version = "0.3.1";
        mygame.isSubContext = false;
        mygame.preUploadTexture = false;
    })(mygame = ourgame.mygame || (ourgame.mygame = {}));
})(ourgame || (ourgame = {}));
(function (ourgame) {
    var mygame;
    (function (mygame) {
        function updateAllScreens() {
            if (!mygame.isRunning) {
                return;
            }
            window['player'].updateScreenSize();
        }
        mygame.isRunning = false;
        function runourgame(options) {
            try {
                my.call('reportCicadaStatus', {
                    reportParams: {
                        engineName: 'ourgame',
                        arg1: '冗余字段'
                    }
                });
            }
            catch (e) { }
            if (mygame.isRunning) {
                return;
            }
            mygame.isRunning = true;
            if (!options) {
                options = {};
            }
            if (options.pro) {
                ourgame.pro.ourgame2dDriveMode = true;
                try {
                    if (window['startup']) {
                        window['startup']();
                    }
                    else {
                        console.error("ourgamePro.js don't has function:window.startup");
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
            mygame.Html5Capatibility._audioType = options.audioType;
            mygame.Html5Capatibility.$init();
            // if (options.renderMode == "webgl") {
            //     var antialias = options.antialias;
            //     mygame.WebGLRenderContext.antialias = !!antialias;
            // }
            // ourgame.sys.CanvasRenderBuffer = mygame.CanvasRenderBuffer;
            // setRenderMode(options.renderMode);
            // var canvasScaleFactor;
            // if (options.canvasScaleFactor) {
            //     canvasScaleFactor = options.canvasScaleFactor;
            // }
            // else if (options.calculateCanvasScaleFactor) {
            //     canvasScaleFactor = options.calculateCanvasScaleFactor(ourgame.sys.canvasHitTestBuffer.context);
            // }
            // else {
            //     var context = ourgame.sys.canvasHitTestBuffer.context;
            //     var backingStore = context.backingStorePixelRatio ||
            //         context.webkitBackingStorePixelRatio ||
            //         context.mozBackingStorePixelRatio ||
            //         context.msBackingStorePixelRatio ||
            //         context.oBackingStorePixelRatio ||
            //         context.backingStorePixelRatio || 1;
            //     canvasScaleFactor = (window.devicePixelRatio || 1) / backingStore;
            // }
            // ourgame.sys.DisplayList.$canvasScaleFactor = canvasScaleFactor;
            // var ticker = ourgame.ticker;
            // startTicker(ticker);
            // if (options.screenAdapter) {
            //     ourgame.sys.screenAdapter = options.screenAdapter;
            // }
            // else if (!ourgame.sys.screenAdapter) {
            //     ourgame.sys.screenAdapter = new ourgame.sys.DefaultScreenAdapter();
            // }
            // var container = {};
            // var player = new mygame.WebPlayer(container, options);
            // window['player'] = player;
            // window.addEventListener("resize", function () {
            //     if (isNaN(resizeTimer)) {
            //         resizeTimer = window.setTimeout(doResize, 300);
            //     }
            // });
        }
        function setRenderMode(renderMode) {
            if (renderMode === "webgl") {
                ourgame.Capabilities["renderMode" + ""] = "webgl";
                ourgame.sys.RenderBuffer = mygame.WebGLRenderBuffer;
                ourgame.sys.systemRenderer = new mygame.WebGLRenderer();
                ourgame.sys.canvasRenderer = new ourgame.CanvasRenderer();
                ourgame.sys.customHitTestBuffer = new mygame.WebGLRenderBuffer(3, 3);
                ourgame.sys.canvasHitTestBuffer = new mygame.CanvasRenderBuffer(3, 3);
            }
            else {
                ourgame.Capabilities["renderMode" + ""] = "canvas";
                ourgame.sys.RenderBuffer = mygame.CanvasRenderBuffer;
                ourgame.sys.systemRenderer = new ourgame.CanvasRenderer();
                ourgame.sys.canvasRenderer = ourgame.sys.systemRenderer;
                ourgame.sys.customHitTestBuffer = new mygame.CanvasRenderBuffer(3, 3);
                ourgame.sys.canvasHitTestBuffer = ourgame.sys.customHitTestBuffer;
            }
        }
        function startTicker(ticker) {
            if (ticker['running']) {
                return;
            }
            ticker['running'] = true;
            var requestAnimationFrame = window["requestAnimationFrame"] ||
                window["webkitRequestAnimationFrame"] ||
                window["mozRequestAnimationFrame"] ||
                window["oRequestAnimationFrame"] ||
                window["msRequestAnimationFrame"];
            if (!requestAnimationFrame) {
                requestAnimationFrame = function (callback) {
                    return window.setTimeout(callback, 1000 / 60);
                };
            }
            requestAnimationFrame(onTick);
            function onTick() {
                if (!ticker['running']) {
                    return;
                }
                requestAnimationFrame(onTick);
                ticker.update(true);
            }
        }
        function stopTicker(ticker) {
            ticker['running'] = false;
        }
        mygame.stopTicker = stopTicker;
        ourgame.runourgame = runourgame;
        ourgame.updateAllScreens = updateAllScreens;
        var resizeTimer = NaN;
        function doResize() {
            resizeTimer = NaN;
            ourgame.updateAllScreens();
        }
    })(mygame = ourgame.mygame || (ourgame.mygame = {}));
})(ourgame || (ourgame = {}));
ourgame.Capabilities["runtimeType" + ""] = ourgame.RuntimeType.TBCREATIVEAPP;

// window.ourgame = ourgame;


var window = $global.window;
window.tbSound = ourgame;