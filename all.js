const showList = document.querySelector('.showList');
const groupBtn = document.querySelector('.button-group');
const typeBtns = document.querySelectorAll('.button-group .btn');
const btnType = document.querySelectorAll(".btn-type");
const sortAdvanced = document.querySelector('.js-sort-advanced');
const crop = document.querySelector('#crop');
const searchBtn = document.querySelector('.search');
const searchKeyword = document.querySelector('#js-crop-name');
const pcSelect = document.querySelector('#js-select');
const mobileSelect= document.querySelector('#js-moblie-select');

let data = [];
const url = 'https://hexschool.github.io/js-filter-data/data.json';

// get所有資料
function getData() {
  axios.get(url)
  .then(res => {    
    data = res.data.filter((item) => item['作物名稱']);
    renderData(data);
  })
  .catch(err => {
    console.log(err.status);
  })
}
getData();


//渲染
function renderData(arr) {
  let str = "";
  arr.forEach(item => {
    str += `
      <tr>
        <td>${item['作物名稱']}</td>
        <td>${item['市場名稱']}</td>
        <td>${item['上價']}</td>
        <td>${item['中價']}</td>
        <td>${item['下價']}</td>
        <td>${item['平均價']}</td>
        <td>${item['交易量']}</td>
      </tr>
    `;
  });
  showList.innerHTML = str;    
}


// 切換「蔬菜」「水果」「花卉」篩選
let filterData = [];
let filterStr = '';
groupBtn.addEventListener('click', filterBtnType);
function filterBtnType (e){  
  if (e.target.nodeName !== 'BUTTON') return; 
  filterData = data.filter(item => item['種類代碼'] == e.target.dataset.type); 
  filterStr = e.target.textContent;
  clickBtnActive(filterStr);  
  renderData(filterData); 
  searchKeyword.textContent = '';
  };    
  
  
//改變按鈕顏色
function clickBtnActive(str) {  
  typeBtns.forEach(item => {    
    if(item.innerText == str) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });   
}


//search查詢功能
let searchData = [];
searchBtn.addEventListener("click", searchCrop);
function searchCrop(e){
  const cropStr = crop.value.trim();
  if( cropStr == "") return alert("請輸入作物名稱");    
  
  const reg = new RegExp(cropStr);
  
  filterData = data.filter((item) => {
    if(item['作物名稱'] !== null) {
      searchKeyword.textContent = `查看「${cropStr}」的搜尋結果`;      
      return reg.test(item['作物名稱']);
    } 
    
  });  
  renderData(filterData); 
  crop.value = '';
  
  if (filterData.length == 0) {
    showList.innerHTML = `<tr>
    <td colspan="6" class="text-center p-3">查詢不到交易資訊QQ</td>
    </tr>`;
  } else {     
    renderData(filterData);
  }
  
  //移除按鈕顏色
  typeBtns.forEach(item => {
    item.classList.remove('active');
  })
  }




// 變換 select 的排序
pcSelect.addEventListener("change", function () {
  switch (pcSelect.value) {
    case "依上價排序":
      changeSelect("上價");
      break;
    case "依中價排序":
      changeSelect("中價");
      break;
    case "依下價排序":
      changeSelect("下價");
      break;
    case "依平均價排序":
      changeSelect("平均價");
      break;
    case "依交易量排序":
      changeSelect("交易量");
      break;
    default:
      break;
  }
});

function changeSelect(value) {
  filterData.sort((a, b) => {
    return b[value] - a[value];
  });
  renderData(filterData);
  searchKeyword.textContent = '';
}


// 資料排序
sortAdvanced.addEventListener("click", function (e) {
  const arrow = e.target.getAttribute("data-sort");
  const price = e.target.getAttribute("data-price");
  if (arrow == "up") {
    filterData.sort((a, b) => {
      return b[price] - a[price];
    });
  } else if (arrow == "down") {
    filterData.sort((a, b) => {
      return a[price] - b[price];
    });
  }
  renderData(filterData);
  searchKeyword.textContent = '';
});
