// Data module for manipulating data
var dataModule = (function(){
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val){
            var newItem, ID;
        
            if (data.allItems[type].length > 0){
                // create new id and it relative to array position
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // make new item based on data type
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            // add to data array
            data.allItems[type].push(newItem);

            return newItem;
        },

        testing: function(){
            console.log(data);            
        }
    }
})();

// UI module for manipulating data display
var interfaceModule = (function(){
    // make code more independent / if markup changes we need only change this object
    var DOM = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    };

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOM.inputType).value,
                description: document.querySelector(DOM.inputDescription).value,
                value: document.querySelector(DOM.inputValue).value
            };
        },

        addListItem: function(obj, type){
            var html, element, newHtml;
            // create html string with placeholders
            if (type === 'inc'){
                element = DOM.incomeContainer;
                html = '<div class="item clearfix" id="income-!id!"><div class="item__description">!description!</div><div class="right clearfix"><div class="item__value">!value!</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOM.expensesContainer;
                html = '<div class="item clearfix" id="expense-!id!"><div class="item__description">!description!</div><div class="right clearfix"><div class="item__value">!value!</ div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace placeholder text with actual text
            var replacement = html.replace(/!id!/, obj.id).replace(/!description!/, obj.description).replace(/!value!/, obj.value);

            // jonas' solution
            // newHtml = html.replace('!id!', obj.id);
            // newHtml = newHtml.replace('!description!', obj.description);
            // newHtml = newHtml.replace('!value!', obj.value);

            // insert html text
            document.querySelector(element).insertAdjacentHTML('beforeend', replacement);
        },

        // make DOM accessible to other modules
        getDOM: function(){
            return DOM;
        }
    };
})();

// global module for managing previous modules
var globalModule = (function(dataMod, UIMod){
    let DOM = UIMod.getDOM();

    var setEventListeners = function(){
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e){
            if (e.key === 'Enter' || e.which === 13){
                ctrlAddItem();
            }
        });
    };
   
    var ctrlAddItem = function(){
        var input, newItem;
        // 1. get input
        input = UIMod.getInput();
        
        // add item to dataMod
        newItem = dataMod.addItem(input.type, input.description, input.value);
        
        // add item to UIMod
        UIMod.addListItem(newItem, input.type);
        
        // calculate
        // display
    };

    return {
        init: function(){
            setEventListeners();
            console.log('App running');
        }
    };
})(dataModule, interfaceModule);

globalModule.init();


