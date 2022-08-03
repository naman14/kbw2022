  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
//   import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-firestore.js";
  import { getFirestore , collection, query, where, getDocs, setDoc, addDoc} from "https://cdnjs.cloudflare.com/ajax/libs/firebase/9.8.4/firebase-firestore.min.js"

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBWMhFi29OmENJPhcIueATaVNc5iDm3npI",
    authDomain: "kbw2022-966ad.firebaseapp.com",
    projectId: "kbw2022-966ad",
    storageBucket: "kbw2022-966ad.appspot.com",
    messagingSenderId: "203158962745",
    appId: "1:203158962745:web:1ad454959b9257fdb403e8",
    measurementId: "G-HTW677W204"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app)


const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const memberId = params.u

showLoading()

let isPosting = false
let totalMembers = 0

document.getElementById('add-member').addEventListener("click",
  function(){ 
    if (isPosting) {
      postMember()
    } else {
      document.getElementById('post-container').style.display = 'flex'
      document.getElementById('add-member').innerHTML = 'Submit'
      isPosting = true
    }
  
});

async function postMember() {
  let name = document.getElementById('input-name').value
  let company = document.getElementById('input-company').value
  let designation = document.getElementById('input-designation').value
  let description = document.getElementById('input-description').value
  let twitter = document.getElementById('input-twitter').value

  let memberDetails = {
    name, company, designation, description, twitter, 
    memberId: totalMembers + 1
  }

  showLoading()
  await addDoc(collection(db, "members"), memberDetails);
  hideLoading()

  isPosting = false
  document.getElementById('post-container').style.display = 'none'
  document.getElementById('add-member').innerHTML = 'Post myself'
  showAllMembers()
}

if (!isNaN(memberId)) {
    const q = query(collection(db, "members"), where("memberId", "==", memberId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.length > 0) {
        hideLoading()
        showMember(querySnapshot[0].data())
   } else {
        showAllMembers()
   }
} else {
    showAllMembers()
}

async function showAllMembers() {
  showLoading()
  document.getElementById('list-container').innerHTML = ''
    const q = query(collection(db, "members"));
    const querySnapshot = await getDocs(q);
    totalMembers = querySnapshot.size
    document.getElementById('member-count').innerHTML = `${querySnapshot.size} members`
    hideLoading()
    querySnapshot.forEach((doc) => {
        showMember(doc.data())
    });
}

function showMember(member) {
    console.log(member)
    let str = `
    <div class="card" style='text-align: left;'>
      <div style="display: flex; flex-direction: row; align-items: center;">
        <div style="flex-grow: 1;">
        <p style='font-weight:500, font-size:18px; line-height:1px;'>${member.name}</p>
        <p style='opacity:0.4; font-weight:400, font-size:16px; line-height:1px; padding-top: 8px;'>${member.designation}, ${member.company}</p>
        </div>
        <img id='twitter-${member.memberId}' src="./twitter.png" width="30" height="30" style='cursor: pointer;'/>
      </div>
        <p style='padding-top: 0px;'>${member.description}</p>
    </div>
  `
    const columnDiv = document.createElement("div")
    columnDiv.className = 'column'
    columnDiv.innerHTML = str;
    document.getElementById('list-container').appendChild(columnDiv)
    document.getElementById(`twitter-${member.memberId}`).addEventListener("click",
     function(){ 
      window.open(`https://www.twitter.com/${member.twitter}`, '_blank').focus();
    });
    if (!member.twitter || member.twitter.length == 0) {
      document.getElementById(`twitter-${member.memberId}`).style.display = 'none'
    }
}

function showLoading() {
    document.getElementById('loader').style.visibility = 'visible'
}

function hideLoading() {
    document.getElementById('loader').style.visibility = 'hidden'
}