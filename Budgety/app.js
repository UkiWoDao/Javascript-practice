// IDEA: make color more intense as the percentage increases
// IDEA: add currency convertor
// IDEA: add debt

// Data module for manipulating data
var dataModule = (function(){
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }
    }

    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };

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

            data.allItems[type].push(newItem);

            return newItem;
        },

        deleteItem: function(type, id){
            var ids, index;

            // since id !== index of the item, data.allItems[type][id] doesn't work
            // create new array with all item ids
            ids = data.allItems[type].map(function(current){
                return current.id;               
            }); 

            // find array position of item 
            index = ids.indexOf(id);
            
            // check if id is in array, otherwise index is -1
            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
          
        calculateBudget: function(){
            // 1. calculate budget
            calculateTotal('exp');
            calculateTotal('inc');

            // 2. calculate budget
            data.budget = data.totals.inc - data.totals.exp;

            // 3. calculate expenses in percentages
            if (data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function(){
            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc);
            })
        },

        getPercentages: function(){
            allPercentages = data.allItems.exp.map(function(current){
                return current.getPercentage();
            });
            return allPercentages;
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
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        itemPercentages: '.item__percentage',
        monthLabel: '.budget__title--month'
    };

    // from this input e.g. 1000000 to this output format 1.000.000,00
    var formatNumber = function(num, type){
        var numSplit, int, dec, type;
        // make number absolute 
        num = Math.abs(num);

        // add (2) decimal points
        num = num.toFixed(2);

        // divide string into int(eger) and dec(imal) arrays of strings
        numSplit = num.split('.');
        
        // 25600
        // insert comma after every 3 digits
        int = numSplit[0];
        if (int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
        }
        
        dec = numSplit[1];
        
        // sign relative to type
        if (type === 'exp'){
            sign = '-';
        } else {
            sign = '+';
        }

        // insert sign, concatenate and return
        return sign + ' ' + int + '.' + dec;
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
                html = '<div class="item clearfix" id="inc-!id!"><div class="item__description">!description!</div><div class="right clearfix"><div class="item__value">!value!</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOM.expensesContainer;
                html = '<div class="item clearfix" id="exp-!id!"><div class="item__description">!description!</div><div class="right clearfix"><div class="item__value">!value!</div><div class="item__percentage">!21%!</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // 1. solution: replace placeholder text with actual text
            replacement = html.replace(/!id!/, obj.id).replace(/!description!/, obj.description).replace(/!value!/, formatNumber(obj.value, type));

            // 2. solution:
            // newHtml = html.replace('!id!', obj.id);
            // newHtml = newHtml.replace('!description!', obj.description);
            // newHtml = newHtml.replace('!value!', obj.value);

            // insert html text
            document.querySelector(element).insertAdjacentHTML('beforeend', replacement);
        },

        deleteListItem: function(elID){
            let element = document.getElementById(elID);
            element.parentNode.removeChild(element);
        },

        // clear input fields
        clearFields: function(){
            var fields;
           
            fields = document.querySelectorAll(DOM.inputDescription + ', ' + DOM.inputValue)
          
            // convert to array so we can loop
            fieldsArr = Array.from(fields);
            // another way: fieldsArr = Array.prototype.slice.call(fields);

            // loop through array and reset
            fieldsArr.forEach(function(current){
                current.value = '';
            });

            // focus the first input after clearing
            fieldsArr[0].focus();  
        },

        // display data in UI
        displayBudget: function(obj){
            if (obj.budget > 0){
                type = 'inc';
            } else {
                type = 'exp';
            }
            document.querySelector(DOM.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOM.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(DOM.expensesLabel).textContent = formatNumber(obj.totalExpenses, 'exp');

            if (obj.percentage > 0){
                document.querySelector(DOM.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOM.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOM.itemPercentages);

            var nodeListForEach = function(list, callback){
                for (var i = 0; i < list.length; i++){
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(current, index){
                if (percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function(){
            var now, months, month, year;

            // grab Date object
            now = new Date();

            // getMonth returns zero based index
            month = now.getMonth();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            year = now.getFullYear();
            document.querySelector(DOM.monthLabel).textContent = months[month] + ' ' + year;
        }
        ,
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

        // document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    };
   
    var updatePercentages = function(){
        // 1. calculate percentages
        dataMod.calculatePercentages();

        // 2. grab percentages
        var percentages =  dataMod.getPercentages();

        // 3. display percentages in UI
        UIMod.displayPercentages(percentages);        
    };

    var updateBudget = function(){
        // 1. calculate the budget
        dataMod.calculateBudget();

        // 2. return the budget
        var budget = dataMod.getBudget();

        // 3. display the budget
        UIMod.displayBudget(budget);
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
            
            // 6. update percentages
            updatePercentages();
        ;}
    };

    var ctrlDeleteItem = function(e){
        var itemID, splitID, type, ID;

        // traversing not a problem if the inserted html is hardcoded / to be avoided otherwise
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;                 
        if (itemID){
            // split returns an array of strings
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);                      
            
            // 1. delete from data module
            dataMod.deleteItem(type, ID);

            // 2. delete from interface
            UIMod.deleteListItem(itemID);

            // 3. update interface
            updateBudget();

            // 4. update percentages
            updatePercentages();
        }
    }

    return {
        init: function(){
            setEventListeners();
            UIMod.displayMonth();
            console.log('App running');
        }
    };
})(dataModule, interfaceModule);

globalModule.init();
