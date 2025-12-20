require('dotenv').config({ path: '.env.local' });
const Redis = require('ioredis');

const updates = {
    "1765055024098p394bhg": {
        title: "Gautam Gambhir’s 'Stay in Your Domain' Speech: A Defining Moment in Indian Coaching Philosophy",
        body: `Head coach Gautam Gambhir recently delivered a blunt press conference, stating that split coaching and external influence on the national team should stay within their respective domains. Gambhir’s approach emphasizes result-driven unity and protecting the dressing room from social media noise. His no-nonsense attitude signals a return to a more disciplined team environment, focusing on players winning matches rather than external data or opinions. This "closed-door" philosophy aims to shield players from distractions during transition phases.`
    },
    "1765054943564oh0h7a4": {
        title: "The Fakhar Zaman Fine and the ICC Disciplinary Code: A Question of Fairness in Cricket?",
        body: `ICC has handed Fakhar Zaman a 10% match fee fine for showing dissent, sparking debates about consistency across teams. Fans have questioned whether similar actions by high-profile Indian or Australian players face comparable repercussions. The disciplinary code aims to maintain the "Spirit of the Game" and umpire authority, but the perceived lack of transparency leads to concerns about fairness. Fakhar’s aggressive style remains his greatest asset, but he must temper emotions to avoid match bans during critical tour phases.`
    },
    "1765054098479fuidpjk": {
        title: "R. Ashwin’s Tactical Vision: Could a Rohit-Kohli Opening Duo Win the 2027 World Cup?",
        body: `Ravichandran Ashwin suggested that India should consider Rohit Sharma and Virat Kohli to open the innings for the 2027 ODI World Cup, with Ruturaj Gaikwad at number three. This tactical shift aims to maximize experience and neutralize new-ball threats in challenging conditions. While critics worry about age and exposing stars too early, the idea highlights a focus on role clarity and building a stable core for major ICC events. Ashwin’s vision continues to provide fresh perspectives on optimizing India's legendary resources.`
    },
    "17650539233979hrg3nj": {
        title: "Gautam Gambhir’s Faith in Ruturaj Gaikwad: The Making of India’s Next Batting Mainstay",
        body: `Gautam Gambhir praised Ruturaj Gaikwad’s technical soundess and adaptability, viewing him as a massive future prospect alongside Yashasvi Jaiswal. Gaikwad’s success in IPL and performance on bouncy SA tracks have proved his maturity. He provides multiple tactical options as an opener or middle-order anchor. Under Gambhir’s guidance, Gaikwad is being given a long rope to develop into a match-winning main stay, representing the technical and aggressive future of the Indian batting hierarchy.`
    },
    "1765053374996-0": {
        title: "India vs Australia T20I Series Preview: A Battle for Supremacy in the Shortest Format",
        body: `The India vs Australia T20I series is a highly anticipated clash between two competitive nations. For India, it’s a crucial prep phase with youngsters like Abhishek Sharma and Tilak Varma testing their mettle. Australia brings power through Travis Head and Glenn Maxwell, with Mitchell Marsh leading. Historically intense, these encounters often feature high-scoring games and individual brilliance. The series holds significant implications for the rankings and provides a platform for the next generation stars of the Gentleman's Game.`
    },
    "1765053374996-1": {
        title: "The Revolution of Live Cricket Coverage: How Real-Time Data is Changing the Fan Experience",
        body: `Live cricket coverage has been revolutionized by real-time data, providing insights like Win Probability and Pitch Maps. Advanced cameras and sensors create an immersive experience, making the game more accessible and educational. interactive fan communities and expert analysis integrated into live feeds bridge the gap between stadium and screen. Future innovations like VR and AR promise to further blur lines, making every boundary and wicket a shared experience for millions of global fans.`
    },
    "1765053374996-2": {
        title: "The Psychological Crucible: Why the First Test Sets the Tone for a Bilateral Series",
        body: `Winning the first Test of a series provides an immediate psychological boost and tactical advantage. It serves as a battle for the moral high ground and forces the losing side into defensive postures. The data gathered during the opening days becomes a blueprint for the series. Historically, series turnarounds are rare after losing the opener, particularly for visiting teams. The first Test remains a significant saga and a proving ground for new talents and leadership styles in Test cricket.`
    },
    "1765053374996-3": {
        title: "IPL 2025 Mega Auction: Strategic Deep Dive into Team Purses and RTM Usage",
        body: `The IPL 2025 Mega Auction features a 120 Crore INR purse and a revamped RTM rule that adds tactical depth. Teams like RCB and Punjab Kings can price out rivals, while others like CSK must pay premiums for their core players. Data and AI identify value candidates in the domestic pool, making the auction a high-stakes three-year investment. The results will redefine the competitive landscape of the world’s most exciting cricket league, following every twist and turn from the auction room.`
    },
    "1765053374996-4": {
        title: "Virat Kohli's Metamorphosis: A Statistical Deep Dive into the Modern Master",
        body: `Virat Kohli’s career evolution shows a master of adaptation and mental resilience, with an unmatched conversion rate in ODI cricket. Data reveals a tactical shift in his handling of spin and dominance in high-pressure chases. His physical fitness allows for constant pressure on fielders through quick running. Kohli’s consistency factor separates him from peers, maintaining high averages across formats. Beyond stats, his passion and hunger for victory continue to inspire millions in the math of cricket.`
    },
    "1765053374996-5": {
        title: "Bazball Under the Microscope: Is England’s Aggressive Style Sustainable or Reckless?",
        body: `England’s 'Bazball' approach, led by McCullum and Stokes, has brought excitement back to Test cricket with record-breaking chases. However, critics argue about its sustainability on challenging foreign pitches where traditional defense is crucial. The physical and mental toll on bowlers due to quick batting sessions is also a concern. The upcoming tours to India and Australia will be the ultimate litmus test for this brave and tactical innovation. Bazball has already succeeded in making every England Test a must-watch event.`
    },
    "1765053374996-6": {
        title: "The Rise of Women’s Cricket: Previewing the Contenders for the ICC Women's World Cup",
        body: `The ICC Women's World Cup sees Australia as undispute favorites with depth and experience. India, with its successful WPL launch, has become a sleeping giant led by Harmanpreet Kaur and Smriti Mandhana. Teams like England and South Africa are also formidable contenders, narrowing the gap between powerhouses and rising stars. The tournament celebrates the growth and professionalization of the game, with quality rising exponentially over the last five years. millions are watching as women’s cricket makes its own historical mark.`
    },
    "1765053374996-7": {
        title: "Science of the Swing: How Bowlers Master the Art of Air Deviation",
        body: `Swing bowling is a complex intersection of physics and ball maintenance, where pressure differences on the ball's sides create air deviation. Reverse swing, occurring with older balls at high speeds, is particularly devastating. Traditional polishing methods and atmospheric conditions play key roles in this technical art. Masters like James Anderson and Mohammed Shami have refined the science into a beautiful part of the game. Swing remains the ultimate weapon of a pace bowler, outfoxing technical batters through inches and degrees of deviation.`
    },
    "1765053374996-8": {
        title: "The Great Cricket Divide: Can International Cricket Survive the T20 League Explosion?",
        body: `The explosion of global T20 leagues has created a divide between national duties and lucrative franchise contracts. Stars increasingly prioritize franchise commitments, challenging the consistency of national teams. While leagues democratize the game and bring financial windfalls, the ICC faces a challenge in maintaining the international calendar's relevance. A hybrid model with recognized league windows might be the future. The Gentleman’s Game is evolving, balancing nostalgia with the excitement of professionalized global franchises.`
    },
    "1765053374996-9": {
        title: "Cricket’s American Dream: How Major League Cricket (MLC) is Conquering the USA",
        body: `Major League Cricket (MLC) has found high hunger for the sport in North America, backed by infrastructure investment in venues like Grand Prairie Stadium. Partnerships with IPL franchises bring global identity, attracting stars like Rashid Khan and Trent Boult. MLC provides a platform for the USA national team, directly contributing to their historic successes. Winning mainstream American consciousness remains a long-term goal. MLC represents a new era for the sport in North America, with vibrant home growth and commercial possibilities.`
    },
    "1765053374996-10": {
        title: "Masters of the Mystery: Ranking the Top 5 Spinners in 2025",
        body: `Spinners like Rashid Khan, Kuldeep Yadav, and Adam Zampa are currently dominating white-ball cricket. Rashid remains the ultimate T20 weapon with his unreadable googly. Kuldeep’s aggressive line and wrist-spin have made him a match-winner for India. Zampa’s tactical game-reading makes him indispensable for Australia. These masters of mystery continue to prove that spin remains an effective weapon despite shorter boundaries. Watching these wizards at work highlights the subtle complexity of the game of cricket in the modern era.`
    },
    "1765053374996-11": {
        title: "The Safe Hands Debate: Solving Team India’s Wicketkeeper Puzzle",
        body: `The hunt for Dhoni's permanent successor involves choices between Rishabh Pant, Sanju Samson, and KL Rahul. Pant offers the X-Factor and has shown a miraculous return to form. Samson’s recent centuries make him a dangerous aggressive candidate. Rahul provides stability and DRS expertise in the middle order. The selection dilemma reflects the depth of talent, as the team management focuses on results and match-ups. Every major series tests who will prioritize safety and explosiveness in the safe hands of India.`
    },
    "1765053374996-12": {
        title: "Historic Venues: Lord's Cricket Ground - The Home of Cricket",
        body: `Lord’s Cricket Ground is a destination of history and tradition, famous for its distinct slope and the legendary Long Room. Scaling a century at Lord’s and entering the Honours Board is the ultimate dream for cricketers. Symbols like Father Time and the JP Morgan Media Centre highlight a blend of tradition with modern innovation. Playing on this hallowed turf is seen as a spiritual pilgrimage for any true lover of the game, preserving the heart and soul of the Gentleman’s Game in London for over two centuries.`
    },
    "1765053374996-13": {
        title: "Fitness Standards in Modern Cricket: Beyond the Yo-Yo Test",
        body: `Modern cricketers are elite athletes, with fitness standards transformed by icons like Kohli and Cummins. Wearable technology tracks load management, preventing injuries and extending careers through diet and nutrition science. Fielders exhibit acrobatic agility due to rigorous training on core strength. While physical standards have risen, there is also a focus on mental fitness and mindfulness. The Gentleman’s Game has become an athlete’s game, where year-round commitment to physical and mental health is baseline for international success.`
    },
    "1765053374996-14": {
        title: "U19 World Cup: Stars of Tomorrow and Proving Ground for Future Legends",
        body: `The U19 World Cup identifies future legends, with past stars like Kohli and Gill emerging from this stage. It provides young athletes their first experience of professional tour life and international pressure. India’s domestic structures have led to multiple titles, nurturing talents like Jaiswal. Not every star makes the senior transition, highlighting the gap and mental maturity needed. The latest edition identified a new crop of ones to watch, ensuring the constant influx of fresh energy and the evolution of the global game.`
    }
};

async function updatePosts() {
    const url = process.env.KV_URL || process.env.REDIS_URL;
    const redis = new Redis(url);
    const data = await redis.get('crictrend:posts');
    if (!data) return;

    let posts = JSON.parse(data);
    let updatedCount = 0;

    posts = posts.map(post => {
        if (updates[post.id]) {
            updatedCount++;
            return {
                ...post,
                title: updates[post.id].title,
                body: updates[post.id].body
            };
        }
        return post;
    });

    await redis.set('crictrend:posts', JSON.stringify(posts));
    console.log(`Successfully updated ${updatedCount} posts in Batch B.`);
    await redis.quit();
}

updatePosts().catch(console.error);
