/* get a good address from an selection of addresses
  @param - candidates : array | possible addresses
  @return - results
*/
export default function getAddress(candidates) {
  console.log("findAddress getAddress", candidates);
  const minimumCandidateScore = 30;
  // the number of results to return to select from when an address could not be found
  const multiResultMax = 5;

  if (candidates.length > 0) {
    let candArray = [];
    const finArray = [];
    let sortArray = [];
    let score = "";

    candArray = candidates.filter((item) => {
      score = item.score || item.Score;
      return ((score >= minimumCandidateScore) && (item.attributes.Loc_name.indexOf("HC") >= 0));
    });

    if (candArray.length === 0) {
      return false;
    }

    sortArray = candArray.sort((a, b) => ((b.score > a.score) ? 1 : ((a.score > b.score) ? -1 : 0)));
    console.log("finArray", finArray);

    sortArray.forEach((c) => {
      score = c.attributes.Score || c.attributes.score;
      if ((c.attributes.Loc_name.indexOf("POINT") >= 0) && (score >= 99)) {
        if (finArray.length < 1) { finArray.push(c); }
      }
    });

    if (finArray.length < 1) {
      score = candArray[0].Score || candArray[0].score;
      if ((candArray[0].attributes.Loc_name.indexOf("HC") >= 0) && (score >= 99)) {
        finArray.push(candArray[0]);
      } else {
        for (let i = 0; i <= multiResultMax; i++) {
          if (candArray[i] != undefined) {
            if (candArray[i].attributes.Loc_name.indexOf("HC") >= 0) {
              finArray.push(candArray[i]);
            }
          }
        }
      }
    }

    console.log("the final array", finArray);
    if (finArray.length > 0) {
      return finArray;
    }

    return false;
  }
  return false;
}
