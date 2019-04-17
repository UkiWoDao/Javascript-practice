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

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });
        data.totals[type] = sum;
    }

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

        calculateBudget: function(){
            // 1. calculate budget
            calculateTotal('exp');
            calculateTotal('inc');

            // 2. calculate budget
            data.budget = data.totals.inc - data.totals.exp;

            // 3. calculate expenses in percentages
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage
            };
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

                // convert input string to number
                value: parseInt(document.querySelector(DOM.inputValue).value)
            };
        },

        addListItem: function(obj, type){
            var html, element, replacement;
            // create html string with placeholders
            if (type === 'inc'){
                element = DOM.incomeContainer;
                html = '<div class="item clearfix" id="income-!id!"><div class="item__description">!description!</div><div class="right clearfix"><div class="item__value">!value!</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOM.expensesContainer;
                html = '<div class="item clearfix" id="expense-!id!"><div class="item__description">!description!</div><div class="right clearfix"><div class="item__value">!value!</ div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // my solution: replace placeholder text with actual text
            replacement = html.replace(/!id!/, obj.id).replace(/!description!/, obj.description).replace(/!value!/, obj.value);

            // jonas' solution
            // newHtml = html.replace('!id!', obj.id);
            // newHtml = newHtml.replace('!description!', obj.description);
            // newHtml = newHtml.replace('!value!', obj.value);

            // insert html text
            document.querySelector(element).insertAdjacentHTML('beforeend', replacement);
        },

        // clear input fields
        clearFields: function(){
            var fields;
           
            fields = document.querySelectorAll(DOM.inputDescription + ', ' + DOM.inputValue)

            // jonas' solution: fieldsArr = Array.prototype.slice.call(fields);

            // mysolution: convert to array so we can loop
            fieldsArr = Array.from(fields);

            // loop through array and reset
            fieldsArr.forEach(function(current){
                current.value = '';
            });

            // focus the first input after clearing
            fieldsArr[0].focus();  
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
   
    var updateBudget = function(){
        // 1. calculate the budget
        dataMod.calculateBudget();

        // 2. return the budget
        var budget = dataMod.getBudget();

        // 3. display the budget
    };

    var ctrlAddItem = function(){
        var input, newItem;
        // 1. get input
        input = UIMod.getInput();
        
        // ensure input fields arent empty
        if (input.description.length !== 0 && !isNaN(input.value)){
            // 2. add item to dataMod
            newItem = dataMod.addItem(input.type, input.description, input.value);
            
            // 3. add item to UIMod
            UIMod.addListItem(newItem, input.type);

            // 4. clear input fields
            UIMod.clearFields();

            // 5. update budget
            updateBudget();            
        }



        // 5. calculate

        // 6. display
    };

    return {
        init: function(){
            setEventListeners();
            console.log('App running');
        }
    };
})(dataModule, interfaceModule);

globalModule.init();


