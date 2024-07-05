//All the input data
let input_elements = document.querySelectorAll('.button-primary')
let carts_lists = document.querySelector('#list-products');
let total_valuation = document.querySelector('#total-sum')
let total_val = 0;



//Classes and functions.

//This takes the input and creates an object of the ordered product.
class Products{
    constructor(product_id, product_name, price, quantity, total){
        this.product_id = product_id;
        this.product_name = product_name;
        this.price = price;
        this.quantity = quantity;
        this.total = total;
    }
}

//Does all the fucnctionality in the productList.
class ProductMenuFunctionality{

//Takes input and creates an object.

    static take_inputs(e){
        let product_container = e.target.parentElement;
        let id = product_container.querySelector('.product-id').textContent;
        let name = product_container.querySelector('.product-name').textContent;
        let price = parseInt(product_container.querySelector('p .price_of').textContent.trim());
        let quantity = parseInt(product_container.querySelector('.quantity-input').value);
        let total = quantity * price;

        
        
        let new_product = new Products(id, name, price, quantity, total);
        
        
        product_container.querySelector('.quantity-input').value = 1;
        
        
        UI.add_product_to_cart(new_product);
        LocalAdded.localStore(new_product);

        


    }

    static remove_clicked(e){
        let tar = e.target;
        if(tar.hasAttribute('type')){
            let main_element = tar.parentElement.parentElement;
            let total = parseInt(main_element.children[4].textContent);
            total_val -= total;

            let product_id = main_element.children[0].textContent;
            LocalAdded.localDelete(product_id);
            UI.AddTotal(total_val);
            main_element.remove();
            
        }
    }

}




//Adds Things to the User Interface

class UI{

    //adds products to the user interface.
    static add_product_to_cart(product_data){
        
        let existing_row = Array.from(carts_lists.children).find(row=> row.firstChild.textContent === product_data.product_id);

        total_val += product_data.total;
        
        if (existing_row){
            let quantity_row = existing_row.children[3];
            let total_row = existing_row.children[4];
            
            let new_quantity = parseInt(quantity_row.textContent) + product_data.quantity;
            let new_total = new_quantity * product_data.price;

            quantity_row.textContent = new_quantity;
            total_row.textContent = new_total;
        }else{
            let table_data = document.createElement('tr');
            table_data.innerHTML = `<td>${product_data.product_id}</td>
                                    <td>${product_data.product_name}</td>
                                    <td>${product_data.price}</td>
                                    <td>${product_data.quantity}</td>
                                    <td>${product_data.total}</td>
                                    <td><button class='button-secondary' id='remove-list' type='button'>Remove</button></td>`;
            
            carts_lists.appendChild(table_data);
        }

        UI.AddTotal(total_val);

    }

    static AddTotal(total_val){

        total_valuation.textContent = total_val;


    }
}


class LocalAdded{
    static checkExistence(){
        let product_list;

        if (localStorage.getItem('product_list') === null){
            product_list = []        
        }else{
            product_list = JSON.parse(localStorage.getItem('product_list'));
        }

        return product_list;
    }

    static localStore(product){
        let product_list = LocalAdded.checkExistence();

        product_list.push(product);

        localStorage.setItem('product_list', JSON.stringify(product_list));

    }

    static localDelete(id){
        let product_list = LocalAdded.checkExistence();

        product_list = product_list.filter(product => product.product_id !== id);

        localStorage.setItem('product_list', JSON.stringify(product_list));
    }

    static localUI(){
        let product_list = LocalAdded.checkExistence();

        product_list.forEach(product =>{
            UI.add_product_to_cart(product);
        })
    }


}









//Events in the website


//activates when add to cart is activated.
input_elements.forEach(input =>{
    input.addEventListener('click', ProductMenuFunctionality.take_inputs);
})


//when remove button is clicked.
carts_lists.addEventListener('click', ProductMenuFunctionality.remove_clicked);

document.addEventListener('DOMContentLoaded', LocalAdded.localUI);
