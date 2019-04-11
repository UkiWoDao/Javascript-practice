// BUDGET CONTROLLER
var budgetController = (function(){
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var Income = function(id, description, value){
      this.id = id;
      this.description = description;
      this.value = value;
    }
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };
    return {
        addItem: function(type, des, val){
            var newItem, ID;
            
            // create new ID
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }      
            
            // create new item
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc');
                newItem = new Income(ID, des, val); 

            // save to array    
            data.allItems[type].push(newItem);

            // return new instance
            return newItem;       
        }    
    }
})();

// UI CONTROLLER
var UIController = (function(){
    // if markup is changed we need only change this object
    var DOMdata = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };
    return {
        getInput: function(){
            return {
              type : document.querySelector(DOMdata.inputType).value, //inc or exp
              description : document.querySelector(DOMdata.inputDescription).value,
              value : document.querySelector(DOMdata.inputValue).value
            };            
        },
        addListItem: function(obj, type){
            var html, newHtml, element;

            // create html element depending on type
            // ! only makes it easier to spot the placeholders which will be replaced by the obj parameter
            if (type === 'inc'){
                element = DOMdata.incomesContainer;
                html = '<div class="item clearfix" id="income-!id!"><div class="item__description">!description!</div><div class="right clearfix"><div class="item__value">!value!</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOMdata.expensesContainer;
                html = '<div class="item clearfix" id="expense-!id!"><div class="item__description">!description!</div><div class="right clearfix"><div class="item__value">!value!</ div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace placeholder text
            newHtml = html.replace('!id!', obj.id);
            newHtml = newHtml.replace('!description!', obj.description);
            newHtml = newHtml.replace('!value!', obj.value);

            // insert into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        // replace in UI 
        clearFields: function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMdata.inputDescription + ', ' + DOMdata.inputValue);
            // fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr = Array.from(fields);
            fieldsArr.forEach(function(current, index, array){
                current.value = '';
            });
            fieldsArr[0].focus();   
        },
        getDOMdata: function(){
            return DOMdata;
        }
    };
})();

// GLOBAL APP CONTROLER
var controller = (function(budgetCtrl, UICtrl){   
    var setEventListeners = function(){
        var DOM = UICtrl.getDOMdata();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(e){
          if (e.key === 'Enter'){
            ctrlAddItem();         
          }       
        })
    }
    var ctrlAddItem = function(){
        var input, newItem;

        // 1. get input data
        input = UICtrl.getInput();    

        // 2. add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. add item to UI
        UICtrl.addListItem(newItem, input.type);
        // 4. calculate budget

        UICtrl.clearFields();

        // 5. display budget on UI
    }
    return {
        init: function(){
            console.log('App started');
            setEventListeners();  
        }
    };
})(budgetController, UIController); // these parameters 
// get passed as 'budgetCtrl' and 'UICtrl'

controller.init();