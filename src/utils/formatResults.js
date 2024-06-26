const pb = {
    le: '<:links:1230896907157770250>',
    me: '<:mid:1230896905882566758>',
    re: '<:rechts:1230896904448245810>',
    lf: '<:leftfull:1230896902094983239> ',
    mf: '<:midfull:1230896901193334886> ',
    rf: '<:rightfull:1230896899809345607>',
  };
   
  function formatResults(upvotes = [], downvotes = []) {
    const totalVotes = upvotes.length + downvotes.length;
    const progressBarLength = 14;
    const filledSquares = Math.round((upvotes.length / totalVotes) * progressBarLength) || 0;
    const emptySquares = progressBarLength - filledSquares || 0;
   
    if (!filledSquares && !emptySquares) {
      emptySquares = progressBarLength;
    }
   
    const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
    const downPercentage = (downvotes.length / totalVotes) * 100 || 0;
   
    const progressBar =
      (filledSquares ? pb.lf : pb.le) +
      (pb.mf.repeat(filledSquares) + pb.me.repeat(emptySquares)) +
      (filledSquares === progressBarLength ? pb.rf : pb.re);
   
    const results = [];
    results.push(
      `👍 ${upvotes.length} upvotes (${upPercentage.toFixed(1)}%) • 👎 ${
        downvotes.length
      } downvotes (${downPercentage.toFixed(1)}%)`
    );
    results.push(progressBar);
   
    return results.join('\n');
  }
   
  module.exports = formatResults;