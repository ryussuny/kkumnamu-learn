/* 영어 데이터: 단어, 변화표, 문장.
   ※ 단어는 "초등 필수 어휘 수준의 기초 단어"를 직접 고른 것이다. 교육부 고시 별표의 어휘 목록과 일치한다고
     주장하지 않는다(원문 목록을 확보하지 못함 — docs/research.md 2-2). 학년군당 300단어 이내 상한을 지킨다.
   형식 'word:뜻' — 뜻은 한 단어에 하나만 쓰고, 같은 뜻이 두 단어에 겹치지 않게 한다(scripts/check-eng.js 가 확인). */
(function (g) {
  var KN = g.KN = g.KN || {};
  function parse(s) { return s.trim().split(/\s*\n\s*/).join(' ').split(/\s*,\s*/).filter(Boolean).map(function (x) { var i = x.indexOf(':'); return { w: x.slice(0, i).trim(), ko: x.slice(i + 1).trim() }; }); }

  /* 초3~4 */
  KN.engWordsA = parse(
    'red:빨간색, blue:파란색, yellow:노란색, green:초록색, black:검은색, white:흰색, pink:분홍색, brown:갈색,' +
    'dog:개, cat:고양이, bird:새, fish:물고기, rabbit:토끼, horse:말, cow:소, pig:돼지, monkey:원숭이, tiger:호랑이, lion:사자, elephant:코끼리, bear:곰, duck:오리, chicken:닭, mouse:쥐, sheep:양, frog:개구리,' +
    'apple:사과, banana:바나나, milk:우유, bread:빵, egg:달걀, rice:밥, water:물, cake:케이크, pizza:피자, juice:주스, cheese:치즈, soup:수프, grape:포도, tomato:토마토, potato:감자, carrot:당근, cookie:쿠키, candy:사탕, meat:고기, salad:샐러드,' +
    'mother:어머니, father:아버지, mom:엄마, dad:아빠, brother:남자 형제, sister:여자 형제, grandmother:할머니, grandfather:할아버지, family:가족, friend:친구, baby:아기, boy:소년, girl:소녀,' +
    'school:학교, teacher:선생님, student:학생, book:책, pencil:연필, desk:책상, bag:가방, eraser:지우개, ruler:자, classroom:교실, chair:의자, notebook:공책, door:문, window:창문,' +
    'head:머리, eye:눈, nose:코, mouth:입, ear:귀, hand:손, foot:발, arm:팔, leg:다리, hair:머리카락, face:얼굴,' +
    'run:달리다, walk:걷다, jump:뛰어오르다, eat:먹다, drink:마시다, read:읽다, write:쓰다, sing:노래하다, dance:춤추다, sleep:자다, swim:수영하다, open:열다, sit:앉다, stand:서다, look:바라보다, listen:듣다, draw:그리다, cook:요리하다, wash:씻다, help:돕다,' +
    'big:큰, small:작은, hot:더운, cold:추운, happy:행복한, sad:슬픈, new:새로운, tall:키가 큰, fast:빠른, slow:느린, long:긴, good:좋은, bad:나쁜, pretty:예쁜,' +
    'one:하나, two:둘, three:셋, four:넷, five:다섯, six:여섯, seven:일곱, eight:여덟, nine:아홉, ten:열,' +
    'sunny:화창한, rainy:비 오는, cloudy:흐린, snowy:눈 오는, windy:바람 부는, Monday:월요일, Tuesday:화요일, Wednesday:수요일, Thursday:목요일, Friday:금요일, Saturday:토요일, Sunday:일요일,' +
    'home:집, park:공원, zoo:동물원, library:도서관, hospital:병원, store:가게, room:방, kitchen:부엌, garden:정원,' +
    'ball:공, car:자동차, bus:버스, bike:자전거, train:기차, hat:모자, shoes:신발, clock:시계, phone:전화기, box:상자, tree:나무, flower:꽃, sun:해, moon:달, star:별'
  );

  /* 초5~6 */
  KN.engWordsB = parse(
    'morning:아침, afternoon:오후, evening:저녁, night:밤, today:오늘, tomorrow:내일, yesterday:어제, week:주, month:달(월), weekend:주말, minute:분, hour:한 시간, birthday:생일, holiday:휴일,' +
    'math:수학, science:과학, music:음악, art:미술, English:영어, history:역사,' +
    'doctor:의사, nurse:간호사, farmer:농부, singer:가수, pilot:조종사, firefighter:소방관, scientist:과학자, artist:예술가, driver:운전사, dentist:치과 의사, baker:제빵사, writer:작가,' +
    'visit:방문하다, travel:여행하다, build:짓다, climb:오르다, catch:잡다, throw:던지다, carry:나르다, learn:배우다, teach:가르치다, ask:묻다, answer:대답하다, buy:사다, sell:팔다, wait:기다리다, meet:만나다, enjoy:즐기다, forget:잊다, remember:기억하다, wear:입다, choose:고르다, bring:가져오다, send:보내다, win:이기다, start:시작하다, finish:끝내다, need:필요하다, want:원하다, like:좋아하다, think:생각하다, know:알다, speak:말하다, ride:타다, fly:날다, push:밀다, pull:당기다,' +
    'angry:화난, tired:피곤한, hungry:배고픈, thirsty:목마른, excited:신이 난, scared:겁먹은, surprised:놀란, proud:자랑스러운, lonely:외로운, shy:수줍어하는, brave:용감한, sleepy:졸린,' +
    'beautiful:아름다운, difficult:어려운, easy:쉬운, delicious:맛있는, dangerous:위험한, important:중요한, famous:유명한, funny:재미있는, quiet:조용한, busy:바쁜, cheap:값싼, expensive:비싼, heavy:무거운, clean:깨끗한, dirty:더러운, strong:강한, weak:약한, rich:부유한, poor:가난한, smart:영리한, wet:젖은, dry:건조한, empty:빈, full:가득 찬,' +
    'station:역, airport:공항, bakery:빵집, museum:박물관, restaurant:식당, market:시장, mountain:산, river:강, sea:바다, forest:숲, island:섬, city:도시, country:나라, village:마을, beach:해변, farm:농장, street:거리,' +
    'spring:봄, summer:여름, autumn:가을, winter:겨울, season:계절, weather:날씨, rain:비, snow:눈(내리는 눈), wind:바람, storm:폭풍, rainbow:무지개, cloud:구름,' +
    'money:돈, ticket:표, picture:그림, movie:영화, game:게임, party:파티, vacation:방학·휴가, letter:편지, gift:선물, camera:카메라, computer:컴퓨터, story:이야기, language:언어'
  );

  /* 파닉스: 소리 묶음은 Jolly Phonics 순서(s a t i p n / c k e h r m d / g o u l f b)를 따랐다 */
  KN.engCVC = parse('cat:고양이, dog:개, pig:돼지, hen:암탉, sun:해, bus:버스, bed:침대, cup:컵, hat:모자, pen:펜, map:지도, net:그물, pin:핀, bag:가방, box:상자, cap:야구 모자, fan:선풍기, jam:잼, leg:다리, mop:대걸레, nut:견과, pot:냄비, rat:쥐, van:승합차, web:거미줄, zip:지퍼');
  KN.engDigraph = [
    { w: 'ship', ko: '배', d: 'sh' }, { w: 'shoe', ko: '신발', d: 'sh' }, { w: 'shop', ko: '가게', d: 'sh' },
    { w: 'chair', ko: '의자', d: 'ch' }, { w: 'cheese', ko: '치즈', d: 'ch' }, { w: 'chin', ko: '턱', d: 'ch' },
    { w: 'thumb', ko: '엄지손가락', d: 'th' }, { w: 'three', ko: '셋', d: 'th' }, { w: 'think', ko: '생각하다', d: 'th' },
    { w: 'whale', ko: '고래', d: 'wh' }, { w: 'wheel', ko: '바퀴', d: 'wh' }
  ];

  /* 동사: [기본, 3인칭 단수, 과거, 과거분사, -ing, 뜻] */
  KN.engVerbs = [
    ['go', 'goes', 'went', 'gone', 'going', '가다'], ['eat', 'eats', 'ate', 'eaten', 'eating', '먹다'], ['see', 'sees', 'saw', 'seen', 'seeing', '보다'],
    ['write', 'writes', 'wrote', 'written', 'writing', '쓰다'], ['take', 'takes', 'took', 'taken', 'taking', '가져가다'], ['give', 'gives', 'gave', 'given', 'giving', '주다'],
    ['make', 'makes', 'made', 'made', 'making', '만들다'], ['buy', 'buys', 'bought', 'bought', 'buying', '사다'], ['come', 'comes', 'came', 'come', 'coming', '오다'],
    ['run', 'runs', 'ran', 'run', 'running', '달리다'], ['read', 'reads', 'read', 'read', 'reading', '읽다'], ['know', 'knows', 'knew', 'known', 'knowing', '알다'],
    ['sing', 'sings', 'sang', 'sung', 'singing', '노래하다'], ['swim', 'swims', 'swam', 'swum', 'swimming', '수영하다'], ['drink', 'drinks', 'drank', 'drunk', 'drinking', '마시다'],
    ['speak', 'speaks', 'spoke', 'spoken', 'speaking', '말하다'], ['break', 'breaks', 'broke', 'broken', 'breaking', '깨뜨리다'], ['tell', 'tells', 'told', 'told', 'telling', '말해 주다'],
    ['play', 'plays', 'played', 'played', 'playing', '놀다'], ['watch', 'watches', 'watched', 'watched', 'watching', '지켜보다'], ['study', 'studies', 'studied', 'studied', 'studying', '공부하다'],
    ['walk', 'walks', 'walked', 'walked', 'walking', '걷다'], ['help', 'helps', 'helped', 'helped', 'helping', '돕다'], ['visit', 'visits', 'visited', 'visited', 'visiting', '방문하다'],
    ['cook', 'cooks', 'cooked', 'cooked', 'cooking', '요리하다'], ['wash', 'washes', 'washed', 'washed', 'washing', '씻다'], ['listen', 'listens', 'listened', 'listened', 'listening', '듣다'],
    ['work', 'works', 'worked', 'worked', 'working', '일하다'], ['live', 'lives', 'lived', 'lived', 'living', '살다'], ['clean', 'cleans', 'cleaned', 'cleaned', 'cleaning', '청소하다']
  ];
  /* 형용사: [기본, 비교급, 최상급] */
  KN.engAdj = [
    ['tall', 'taller', 'tallest'], ['short', 'shorter', 'shortest'], ['big', 'bigger', 'biggest'], ['small', 'smaller', 'smallest'], ['fast', 'faster', 'fastest'],
    ['old', 'older', 'oldest'], ['young', 'younger', 'youngest'], ['long', 'longer', 'longest'], ['hot', 'hotter', 'hottest'], ['cold', 'colder', 'coldest'],
    ['happy', 'happier', 'happiest'], ['easy', 'easier', 'easiest'], ['heavy', 'heavier', 'heaviest'], ['large', 'larger', 'largest'], ['busy', 'busier', 'busiest'],
    ['funny', 'funnier', 'funniest'], ['strong', 'stronger', 'strongest'], ['smart', 'smarter', 'smartest'], ['beautiful', 'more beautiful', 'most beautiful'], ['difficult', 'more difficult', 'most difficult'], ['expensive', 'more expensive', 'most expensive'],
    ['famous', 'more famous', 'most famous'], ['interesting', 'more interesting', 'most interesting'], ['good', 'better', 'best'], ['bad', 'worse', 'worst']
  ];
  /* 비교급·최상급 문장의 주어에 맞는 형용사 갈래 (사람에게 hottest·easiest·heaviest 같은 말이 붙지 않게) */
  KN.engAdjPeople = ['tall', 'short', 'old', 'young', 'fast', 'happy', 'busy', 'funny', 'strong', 'smart'];
  KN.engAdjWeather = ['hot', 'cold'];
  KN.engAdjThing = ['long', 'large', 'big', 'small', 'heavy', 'expensive', 'difficult', 'easy', 'bad', 'good', 'beautiful', 'famous', 'interesting'];
  /* 복수형: [단수, 복수] */
  KN.engPlural = [['box', 'boxes'], ['dog', 'dogs'], ['child', 'children'], ['bus', 'buses'], ['man', 'men'], ['foot', 'feet'], ['woman', 'women'], ['cat', 'cats'], ['watch', 'watches'], ['baby', 'babies'], ['tooth', 'teeth'], ['book', 'books']];

  /* 문장 순서 맞추기 (낱말 순서가 하나로 정해지는 문장만) */
  KN.engOrderA = ['I like apples.', 'This is my bag.', 'She has a pet dog.', 'I am a student.', 'We play soccer.', 'He is my friend.', 'The cat is on the bed.', 'I can swim.', 'My name is Mina.', 'Look at the bird.', 'I have a red ball.', 'She is my sister.', 'They are good friends.', 'It is a big tree.', 'We go to school.', 'I eat bread.', 'He plays the piano.', 'It is a hot day.'];
  KN.engOrder7 = ['My brother goes to school by bus.', 'She does not like cold weather.', 'Tom is taller than Jim.', 'I will visit my grandmother tomorrow.', 'Did you watch TV last night?', 'There are three books on the desk.', 'What time do you get up?', 'They played soccer after school.', 'He can speak English very well.', 'How many apples do you have?', 'My mother is cooking dinner now.', 'Are you going to the library today?', 'She is the tallest girl in my class.', 'I do not have any brothers.'];
  KN.engOrder8 = ['I want to learn English.', 'She enjoys reading books.', 'She has lived in Seoul since 2018.', 'The window was broken by Tom.', 'He decided to study abroad.', 'We have finished our homework.', 'English is spoken in many countries.', 'My sister likes playing the guitar.', 'I have never seen a whale.', 'This room was cleaned by my brother.', 'They plan to visit Jeju next month.', 'Have you ever been to Busan?'];
  KN.engOrder9 = ['The boy who is standing there is my brother.', 'I know a girl whose father is a doctor.', 'This is the book which I bought yesterday.', 'If it rains tomorrow, we will stay home.', 'I do not know where he lives.', 'The movie was so exciting that I watched it twice.', 'She asked me what I was doing.', 'The man talking to Mina is my uncle.', 'Do you know when the bus comes?', 'I was very interested in the story.'];

  /* 알파벳 */
  KN.engAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
