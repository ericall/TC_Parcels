const isValid = false;

/* check that there are the characters are valid
  @param - input : string | the search input
  @return - boolean | if it is valid
*/
function checkWhiteList(input) {
  let good;
  const regex = new RegExp('^[a-zA-Z0-9,./ /-/w#]*$');
  const input2 = input.replace(/-/g, "");
  const newStr = input2.replace(regex, "");
  if (newStr) {
    console.log("not a good address");
    good = false;
  } else {
    console.log('good address...continue');
    good = true;
  }
  return good;
}


/* check if user input is an address
  @param - input : string | the search input
  @return - boolean | if it is an address
*/
function checkIfAddress(input) {
  let isAddress;
  const addressPartsSpace = input.split(" ");
  const addressPartsComma = input.split(",");
  if (addressPartsSpace.length <= 1 || addressPartsComma.length <= 1) {
    /* an address must have more than 1 part */
    isAddress = false;
  } else if (isNaN(addressPartsSpace[0])) {
    /* 1st part of an address needs to be a number */
    isAddress = false;
  } else if (addressPartsComma.length > 1) {
    const addressPartsCommaOne = addressPartsComma[0].split(" ");
    if (addressPartsCommaOne.length <= 1) {
      isAddress = false;
    } else {
      isAddress = true;
    }
  } else {
    isAddress = true;
  }
  return isAddress;
}

/* check if user input is a pid
  @param - searchInput : string | the search input
  @return - object | type of pid and value
*/
function checkIfPid(searchInput) {
  let input = "";
  if (searchInput.split("-").length > 1) {
    input = searchInput.toString().replace(/-/ig, ""); // remove dashes
  } else {
    input = searchInput;
  }

  if (!isNaN(parseFloat(input)) && isFinite(input)) { // check that it is a number
    if (input.length === 13) {
      return { type: "PID", value: input };
    } else if (input.length === 9 || input.length === 7) {
      return { type: "Section", value: input };
    }
    return { type: "Error", value: "Please enter a valid address or PIN" };
  }
  return { type: "Error", value: "Please enter a valid address or PIN" };
}


export default function (searchInput) {
  if (searchInput) { // if there is a searchInput
    const isClean = checkWhiteList(searchInput);

    if (!isClean) { // if is not clean
      return { type: "Error", value: "Please enter a valid address or PIN" };
    } // is clean
    let pid = "";

    const isAddress = checkIfAddress(searchInput);

    if (isAddress) {
      return { type: "Address", value: searchInput };
    }
    pid = checkIfPid(searchInput);
    return pid;
  } // no searchInput
  return { type: "Error", value: "Please enter an address or PID" };
}
