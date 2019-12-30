var date=document.getElementById("datepick");
var unit=document.getElementById("exampleFormControlSelect1");
var plan=document.getElementById("exampleFormControlSelect2");
var check=document.getElementById("checkout");
var data=document.getElementById("dataerr");
var modal=document.getElementById("modalerr");

check.addEventListener("click",function(){
    data.textContent="You Are Ready to Check Out..."
    if(date.value==="Select Date")
        data.textContent="Wrong Date Selected";
    if(unit.value==="Number of Visitors")
        data.textContent="Please select Number of Persons";
    if(plan.value==="select plan")
        data.textContent="Plan Not Selected";
    $('#modalerr').modal('show');  
})
