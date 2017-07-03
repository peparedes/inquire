export default function loader() {
  console.log("just loadered");
  if(document.querySelector('#resLoading')){
    document.querySelector('#resLoading').style.display = 'none';
    document.querySelector('#resDone').style.display = 'block';
  }
}
