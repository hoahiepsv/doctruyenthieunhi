import { Story } from '../types';

export interface ExtendedStory extends Story {
  author?: string;
  readingTimeMinutes: number;
  moral: string;
  category: 'Vietnam' | 'World' | 'Fables' | 'Grimm' | 'Andersen' | 'Greek' | 'Asia' | 'Custom';
  difficulty?: 'Dễ hiểu' | 'Ý nghĩa' | 'Phiêu lưu' | 'Ngụ ngôn';
  ageRange?: 'Mọi lứa tuổi' | 'Mầm non (3-6)' | 'Tiểu học (6-11)';
  iconEmoji: string;
}

export const OFFLINE_STORIES: ExtendedStory[] = [
  // --- VIỆT NAM ---
  {
    id: 'vn-tam-cam',
    title: 'Tấm Cám',
    category: 'Vietnam',
    iconEmoji: '🐟',
    readingTimeMinutes: 7,
    difficulty: 'Ý nghĩa',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Người ở hiền sẽ gặp lành, cái thiện luôn chiến thắng cái ác và sự gian trá.',
    content: `Ngày xưa, có hai chị em cùng cha khác mẹ, chị tên là Tấm, em tên là Cám. Mẹ Tấm mất sớm, sau đó ít năm người cha cũng qua đời, Tấm phải ở với dì ghẻ là mẹ của Cám.

Dì ghẻ là người cay nghiệt, thiên vị, suốt ngày bắt Tấm làm lụng vất vả từ sáng sớm đến tối mịt: quét nhà, gánh nước, chăn trâu, cắt cỏ; còn Cám thì được mẹ nuông chiều, ăn trắng mặc trơn, chỉ biết rong chơi.

Một hôm, mụ dì ghẻ đưa cho hai chị em mỗi người một cái giỏ bảo ra đồng bắt tôm tép, hứa rằng ai bắt được đầy giỏ sẽ được thưởng một chiếc yếm đào đỏ thắm. Tấm vốn chăm chỉ, lội khắp các mương rạch bắt được một giỏ đầy cá tép. Còn Cám mải hái hoa bắt bướm chẳng được con nào. Thấy giỏ Tấm đầy ắp, Cám bảo:
— Chị Tấm ơi chị Tấm! Đầu chị lấm, chị hụp cho sâu kẻo về mẹ mắng!

Tấm thật thà tin lời em, liền lội xuống ao gội đầu. Trên bờ, Cám trút hết tôm tép trong giỏ của Tấm vào giỏ mình rồi chạy một mạch về nhà nhận yếm đào. Khi Tấm bước lên bờ, thấy giỏ trống không, tủi thân ngồi bưng mặt khóc nức nở.

Bỗng nhiên, một làn khói trắng bay lên, ông Bụt với râu tóc bạc phơ hiện ra, ôn tồn hỏi:
— Làm sao con khóc?
Tấm nghẹn ngào kể lại sự tình. Bụt bảo:
— Con hãy nhìn vào giỏ xem còn sót lại con gì không?
Tấm nhìn vào thấy còn một chú cá bống nhỏ xíu. Bụt dặn:
— Con đem cá bống về thả xuống giếng nuôi. Mỗi bữa sau khi ăn, nhớ bớt lại một bát cơm thả xuống cho bống và gọi: "Bống bống bang bang, lên ăn cơm vàng cơm bạc nhà ta, chớ ăn cơm hẩm cháo hoa nhà người".

Từ đó, mỗi ngày sau bữa ăn, Tấm đều giấu cơm ra giếng gọi bống lên ăn. Bống lớn nhanh như thổi và rất quấn quýt với Tấm. Mẹ con Cám sinh nghi, rình biết chuyện liền lừa Tấm đi chăn trâu thật xa rồi ở nhà bắt bống làm thịt.

Khi trở về, Tấm gọi mãi không thấy bống lên, chỉ thấy một cục máu đỏ nổi bồng bềnh. Tấm ôm mặt khóc, Bụt lại hiện lên bảo Tấm nhặt xương bống bỏ vào bốn chiếc lọ rồi chôn dưới bốn chân giường.

Ít lâu sau, nhà vua mở hội linh đình cho toàn dân đến dự. Mẹ con Cám sắm sửa áo quần lộng lẫy đi xem hội. Thấy Tấm muốn đi, dì ghẻ liền trộn một đấu gạo lẫn với một đấu thóc rồi bắt Tấm phải nhặt riêng ra mới được đi. Tấm ngồi khóc, Bụt sai đàn chim sẻ sà xuống nhặt giúp chỉ trong chốc lát đã xong. Bụt lại bảo Tấm đào bốn chiếc lọ dưới chân giường lên: một chiếc hóa thành bộ váy áo gấm lấp lánh, một chiếc thành đôi hài thêu tinh xảo, một chiếc thành chú ngựa chiến dũng mãnh và chiếc yên cương lộng lẫy.

Tấm mừng rỡ cưỡi ngựa đi dự hội. Khi qua cây cầu đá, vì vội vàng, chiếc hài thêu của Tấm bị rơi xuống dòng suối. Đúng lúc ấy, đoàn xa giá của nhà vua đi qua. Đàn voi chiến của vua đến chân cầu bỗng đứng khựng lại gầm vang không chịu bước tiếp. Vua truyền lính mò xuống nước thì vớt được chiếc hài nhỏ nhắn, xinh đẹp vô cùng. Vua truyền lệnh: Hễ cô gái nào ướm chân vừa chiếc hài sẽ được lập làm Hoàng hậu.

Các cô gái quyền quý và thứ dân lần lượt thử hài nhưng không ai vừa. Đến lượt Tấm nhẹ nhàng xỏ chân vào, chiếc hài vừa như in, nàng lại lấy chiếc hài thứ hai trong dải áo ra mang vào. Nhà vua vô cùng mừng rỡ, đón Tấm vào cung mở tiệc cưới linh đình, phong nàng làm Hoàng hậu.

Dù trải qua muôn vàn trắc trở bởi sự đố kỵ và mưu hại tàn độc của mẹ con Cám, Tấm lần lượt hóa thân thành chim vàng anh véo von, hai cây xoan đào che bóng mát, khung cửi răn dạy kẻ ác, và quả thị thơm tho rơi vào bị của một bà cụ nghèo bán nước. Bà cụ thương quả thị đem về nâng niu, mỗi ngày đi chợ về nhà cửa đều được quét dọn sạch sẽ, cơm nước tinh tươm. Một hôm bà cụ nấp sau cánh cửa rình xem, thấy từ quả thị bước ra một nàng tiên xinh đẹp. Bà cụ xé tan vỏ thị, nhận Tấm làm con gái nuôi.

Một ngày nọ, nhà vua đi kinh lý ghé qua quán nước của bà cụ. Thấy miếng trầu têm cánh phượng khéo léo giống hệt trầu Hoàng hậu Tấm têm ngày trước, vua liền gạn hỏi và tìm lại được người vợ hiền thảo. Vua đón Tấm về cung trong niềm hân hoan của muôn dân. Kẻ gian ác mẹ con Cám phải chịu hình phạt thích đáng.

Tấm sống trọn đời hạnh phúc, nhân hậu chăm lo cho nhân dân ấm no.`
  },
  {
    id: 'vn-thach-sanh',
    title: 'Thạch Sanh',
    category: 'Vietnam',
    iconEmoji: '🪓',
    readingTimeMinutes: 8,
    difficulty: 'Phiêu lưu',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Người trung thực, dũng cảm và nhân ái luôn được đền đáp xứng đáng; kẻ xảo trá, bất nhân sẽ gánh lấy quả báo.',
    content: `Ngày xưa ở quận Cao Bình, có hai vợ chồng già sống hiền lành, nhân đức nhưng mãi chưa có con. Cảm động trước tấm lòng của họ, Ngọc Hoàng sai Thái tử đầu thai làm con. Người vợ mang thai mãi ba năm mới sinh ra một cậu bé khôi ngô, đặt tên là Thạch Sanh.

Chẳng bao lâu sau, cha mẹ đều qua đời, Thạch Sanh sống cô độc dưới gốc đa già bên túp lều rách, cả gia tài chỉ có một chiếc khố rách và một chiếc rìu đốn củi cha để lại. Thấy chàng khỏe mạnh, thần tiên đã dạy cho chàng đủ các môn võ nghệ và phép thần thông biến hóa.

Trong vùng có tên Lý Thông chuyên nghề nấu rượu. Thấy Thạch Sanh khỏe mạnh thật thà, Lý Thông liền kết nghĩa huynh đệ với mưu đồ lợi dụng chàng làm việc nặng nhọc cho nhà mình.

Bấy giờ trong vùng có con Chằn tinh hung dữ có phép biến hóa, mỗi năm dân làng phải nộp một mạng người cho nó ăn thịt. Năm ấy đến lượt nhà Lý Thông. Hắn bèn lừa Thạch Sanh đi miếu hoang canh gác thay mình. Nửa đêm, Chằn tinh hiện ra nhe nanh giương vuốt lao vào chàng. Thạch Sanh bình tĩnh dùng rìu và tài võ nghệ giao chiến, sau một hồi quyết liệt chàng đã chém đứt đầu quái vật, đốt xác nó và thu được một bộ cung tên vàng sáng chói.

Khi Thạch Sanh mang đầu Chằn tinh về, mẹ con Lý Thông sợ hãi nhưng lại lập mưu bảo đó là con vật nuôi của vua, dọa Thạch Sanh trốn ngay về gốc đa già, còn Lý Thông cướp công mang đầu Chằn tinh vào cung nộp và được vua phong làm Đô đốc.

Ít lâu sau, trong ngày hội kén rể, công chúa bị một con đại bàng khổng lồ sà xuống bắt cắp bay qua gốc đa. Thạch Sanh trông thấy liền giương cung tên vàng bắn trúng cánh đại bàng. Lần theo vết máu, chàng tìm đến một hang sâu thăm thẳm.

Vua sai Lý Thông đi tìm công chúa. Lý Thông nhờ Thạch Sanh dẫn đường đến hang đại bàng. Thạch Sanh dũng cảm buộc dây thòng lọng tụt xuống hang sâu, đánh tan đại bàng cứu công chúa lên miệng hang. Nhưng khi công chúa vừa lên khỏi miệng hang, Lý Thông tráo trở liền sai quân lăn đá tảng lấp kín miệng hang nhằm chôn sống Thạch Sanh dưới lòng đất.

Bị giam dưới hang tối, Thạch Sanh dùng rìu khai thông ngõ ngách, giải cứu con trai Vua Thủy Tề cũng đang bị giam cầm. Tạ ơn chàng, Vua Thủy Tề tặng chàng vô số vàng ngọc nhưng Thạch Sanh chỉ xin một cây đàn thần rồi trở về gốc đa cũ sinh sống.

Hồn Chằn tinh và Đại bàng căm thù Thạch Sanh, lẻn vào kho vua ăn trộm của cải đem giấu ở gốc đa nhằm vu oan cho chàng. Thạch Sanh bị bắt giam vào ngục tối. Ở trong ngục, chàng lấy cây đàn thần ra gảy. Tiếng đàn kỳ diệu cất lên vang vọng khắp hoàng cung, kể rõ sự tình:
"Đàn kêu tích tịch tình tang
Ai mang công chúa dưới hang trở về..."

Công chúa từ ngày được cứu về bị câm bặt, nghe tiếng đàn bỗng nhiên bật cười, nói được và xin vua cha vời người gảy đàn đến gặp. Tại sân rồng, Thạch Sanh kể lại đầu đuôi mọi chuyện. Vua cha thấu tỏ lòng trung nghĩa, trừng trị mẹ con Lý Thông (sau đó bị sét đánh hóa thành bọ hung) và gả công chúa cho Thạch Sanh.

Mười tám nước chư hầu tức giận vì công chúa lấy chàng tiều phu bèn kéo quân sang vây hãm kinh thành. Thạch Sanh một mình bước ra cổng thành, thong thả gảy đàn thần. Tiếng đàn lúc khoan thai như suối reo, lúc bi tráng như sấm rền làm quân sĩ giặc mềm lòng buông rơi vũ khí, thương nhớ quê nhà.

Chàng lại đem một niêu cơm nhỏ thần kỳ ra thết đãi quân giặc. Quân mười tám nước ăn mãi, ăn mãi mà niêu cơm nhỏ xíu vẫn cứ đầy ắp, khiến quân tướng đều kính cẩn cúi đầu bái phục xin rút quân về nước.

Về sau, vua truyền ngôi cho Thạch Sanh. Đất nước thái bình thịnh trị, nhân dân ấm no hạnh phúc muôn đời.`
  },
  {
    id: 'vn-cay-khe',
    title: 'Cây Khế (Ăn Khế Trả Vàng)',
    category: 'Vietnam',
    iconEmoji: '⭐',
    readingTimeMinutes: 5,
    difficulty: 'Dễ hiểu',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Người chăm chỉ, chất phác sẽ nhận quả ngọt; kẻ tham lam vô độ sẽ chuốc lấy bi kịch.',
    content: `Ngày xưa ở một làng nọ, có hai anh em cha mẹ mất sớm. Khi lớn lên, người anh chia gia tài: anh chiếm hết nhà cửa ruộng vườn trâu bò béo tốt, chỉ chia cho người em một túp lều tranh lụp xụp và một cây khế ngọt ở góc vườn.

Người em không một lời oán trách, sớm hôm chăm bón tưới tắm cho cây khế. Cây khế tươi tốt lạ thường, cành nào cành nấy trĩu trịt những chùm quả vàng óng, mọng nước, thơm ngát cả một vùng.

Đến mùa khế chín, bỗng có một con chim phượng hoàng khổng lồ từ xa bay tới. Mỗi ngày chim đều đáp xuống cành khế mổ ăn những quả ngọt nhất. Vợ chồng người em buồn rầu đứng dưới gốc than thở:
— Chim ơi, gia tài chúng tôi chỉ có một cây khế này để đổi gạo nuôi thân, chim ăn hết thì chúng tôi lấy gì mà sống?

Nghe vậy, chim phượng hoàng liền dừng lại, cất tiếng người nói:
— Ăn một quả, trả một cục vàng, may túi ba gang, mang đi mà đựng!

Người vợ nghe lời chim lấy vải vụn may đúng một chiếc túi ba gang. Sáng hôm sau, chim phượng hoàng bay đến, giang đôi cánh rộng mời người em ngồi lên lưng rồi bay vút qua những ngọn núi cao, vượt qua biển cả bao la đến một hòn đảo ngọc giữa đại dương. Trên đảo toàn là vàng bạc châu báu lấp lánh muôn màu. Người em chỉ nhặt vừa đầy túi ba gang rồi theo chim bay về nhà.

Từ đó, vợ chồng người em trở nên giàu có. Họ đem thóc gạo, của cải giúp đỡ bà con chòm xóm nghèo khó trong vùng.

Người anh nghe tin lạ lùng vội sang tìm hiểu. Biết chuyện, người anh liền gạ đổi toàn bộ ruộng vườn màu mỡ lấy túp lều tranh và cây khế. Người em vui vẻ bằng lòng.

Mùa sau chim phượng hoàng lại tới ăn khế. Người anh giả vờ khóc lóc kêu than. Chim cũng dặn:
— Ăn một quả, trả một cục vàng, may túi ba gang, mang đi mà đựng!

Nhưng với lòng tham vô đáy, người anh không may túi ba gang mà may một chiếc bao tải to tới chín gang, lại còn nhét thêm các túi phụ quanh người.

Hôm sau, chim đưa người anh ra đảo vàng. Hắn hoa cả mắt, vơ vét vàng bạc nén chặt đầy túi chín gang, lại dắt thêm đầy lưng quần, nhét vàng nặng trĩu. Khi chim cất cánh bay qua biển sâu, gặp cơn giông bão, người anh quá nặng khiến chim kiệt sức chao đảo. Chim bảo hắn vứt bớt vàng xuống biển nhưng hắn nhất quyết ôm khư khư lấy của cải. Trong cơn sóng to gió lớn, chim nghiêng cánh hất người anh tham lam rơi xuống đáy biển cùng với túi vàng nặng trĩu.

Còn vợ chồng người em sống phúc hậu, cần cù, được xóm làng yêu quý trọn đời.`
  },
  {
    id: 'vn-thanh-giong',
    title: 'Thánh Gióng (Phù Đổng Thiên Vương)',
    category: 'Vietnam',
    iconEmoji: '🐎',
    readingTimeMinutes: 5,
    difficulty: 'Phiêu lưu',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Tinh thần yêu nước nồng nàn, đoàn kết đánh giặc cứu nước và truyền thống quật cường của dân tộc.',
    content: `Vào đời Hùng Vương thứ sáu, ở làng Phù Đổng có hai vợ chồng một lão nông nghèo sống rất phúc đức nhưng mãi không có con.

Một hôm, bà lão ra đồng thấy một vết chân người khổng lồ in trên mặt đất. Thấy lạ, bà đặt chân mình lên ướm thử. Không ngờ về nhà bà mang thai, đúng mười hai tháng sau sinh ra một bé trai khôi ngô tuấn tú, đặt tên là Gióng. Kỳ lạ thay, cậu bé lên ba tuổi mà chẳng biết nói, chẳng biết cười, đặt đâu nằm đấy.

Bấy giờ giặc Ân sang xâm lược bờ cõi nước ta, thế giặc rất mạnh tàn phá xóm làng. Vua Hùng lo lắng, bèn sai sứ giả đi khắp nơi tìm người tài giỏi cứu nước.

Khi sứ giả đi qua làng Phù Đổng gióng trống rao tin, cậu bé Gióng bỗng nhiên ngồi dậy, cất tiếng nói đầu tiên bảo mẹ:
— Mẹ ra mời sứ giả vào đây cho con!

Sứ giả vào đến nơi, Gióng đĩnh đạc nói:
— Ông về tâu với vua rèn cho ta một con ngựa sắt, một thanh gươm sắt, một áo giáp sắt và một chiếc nón sắt, ta sẽ phá tan lũ giặc này!

Sứ giả mừng rỡ về tâu vua. Vua lập tức truyền thợ rèn ngày đêm đúc ngựa sắt và binh khí.

Từ ngày gặp sứ giả, chú bé lớn nhanh như thổi. Cơm ăn mấy cũng không no, áo vừa may xong đã chật ních. Cha mẹ nấu bao nhiêu cũng không đủ, dân làng Phù Đổng gom góp từng nong cơm, bát cà đem đến nuôi chú bé, mong chú mau lớn giết giặc cứu nước.

Khi quân giặc tràn đến chân núi Trâu Sơn, sứ giả đem ngựa sắt và áo giáp sắt đến. Chú bé Gióng vươn vai một cái bỗng biến thành một tráng sĩ mình cao hơn trượng, oai phong lẫm liệt. Tráng sĩ vỗ vào mông ngựa, ngựa sắt hí vang một tiếng dài, phun ra ngọn lửa đỏ rực.

Gióng mặc giáp sắt, cầm gươm sắt nhảy lên lưng ngựa. Ngựa phi như bay xông thẳng vào quân giặc. Gióng vung gươm chém giặc như chém chuối, ngựa sắt phun lửa thiêu rụi đồn trại quân thù.

Chẳng may gươm sắt bị gãy, Gióng liền nhanh trí nhổ từng bụi tre đằng ngà bên đường quất túi bụi vào quân giặc. Tướng giặc bị chém đầu, tàn quân giặc Ân giẫm đạp lên nhau mà tháo chạy tán loạn.

Đất nước sạch bóng quân thù, tráng sĩ cưỡi ngựa sắt đến đỉnh núi Sóc Sơn, cởi bỏ áo giáp sắt lại, rồi cả người lẫn ngựa từ từ bay thẳng lên trời cao.

Để tưởng nhớ công ơn người anh hùng, vua Hùng phong Gióng là Phù Đổng Thiên Vương và lập đền thờ tại quê nhà. Những bụi tre đằng ngà ngả màu vàng óng và những hồ ao liên tiếp đến nay tương truyền chính là dấu tích vết chân ngựa sắt năm xưa.`
  },
  {
    id: 'vn-son-tinh-thuy-tinh',
    title: 'Sơn Tinh Thủy Tinh',
    category: 'Vietnam',
    iconEmoji: '⛰️',
    readingTimeMinutes: 5,
    difficulty: 'Phiêu lưu',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Giải thích hiện tượng mưa lũ hàng năm và ca ngợi ý chí kiên cường chống thiên tai của nhân dân ta.',
    content: `Hùng Vương thứ mười tám có một người con gái tên là Mị Nương, sắc đẹp tuyệt trần, tính nết thùy mị nết na. Nhà vua muốn kén cho nàng một người chồng thật xứng đáng.

Một hôm, có hai chàng trai tuấn tú cùng đến cầu hôn. Một người ở vùng núi Tản Viên tên là Sơn Tinh, có tài vẫy tay về phía đông phía đông nổi cồn bãi, vẫy tay về phía tây phía tây mọc lên từng dãy núi non trùng điệp. Một người ở miền biển thẳm tên là Thủy Tinh, có tài hô mưa gọi gió, vung tay làm bão táp nổi lên dữ dội.

Cả hai người tài ba ngang ngửa nhau, vua Hùng phân vân không biết chọn ai, bèn bảo:
— Ngày mai, ai đem sính lễ đến trước gồm: một trăm ván cơm nếp, một trăm tệp bánh chưng, voi chín ngà, gà chín cựa, ngựa chín hồng mao, mỗi thứ một đôi thì ta sẽ gả con gái cho.

Sáng sớm hôm sau khi trời vừa hé rạng, Sơn Tinh đã đem đầy đủ sính lễ quý hiếm đến trước cửa thành. Vua Hùng giữ lời hứa, gả công chúa Mị Nương và cho Sơn Tinh rước nàng về núi Tản Viên.

Thủy Tinh đến sau, không lấy được Mị Nương đùng đùng nổi giận, đem quân đuổi theo đòi cướp lại nàng. Thủy Tinh hô mưa, gọi gió, làm thành giông bão rung chuyển đất trời, dâng nước sông lên cuồn cuộn cuộn tràn vào thành Phong Châu. Nước ngập đồng ruộng, ngập nhà cửa, biến cả vùng thành biển nước mênh mông.

Sơn Tinh không hề nao núng. Thần dùng phép thần thông bốc từng quả đồi, dời từng dãy núi, dựng thành lũy đất ngăn chặn dòng nước xiết. Nước dâng lên cao bao nhiêu, núi đồi của Sơn Tinh lại cao lên bấy nhiêu.

Hai bên đánh nhau ròng rã suốt mấy tháng trời. Cuối cùng, Thủy Tinh kiệt sức, đánh không lại đành phải rút quân về biển sâu.

Từ đó oán nặng thù sâu, năm nào Thủy Tinh cũng dâng nước đánh Sơn Tinh làm mưa bão ngập lụt, nhưng lần nào Thủy Tinh cũng thất bại thảm hại trước sức mạnh kiên cường của Sơn Tinh.`
  },
  {
    id: 'vn-so-dua',
    title: 'Sọ Dừa',
    category: 'Vietnam',
    iconEmoji: '🥥',
    readingTimeMinutes: 6,
    difficulty: 'Ý nghĩa',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Đừng bao giờ đánh giá con người qua vẻ bề ngoài, lòng nhân hậu và tài năng sẽ luôn tỏa sáng.',
    content: `Ngày xưa có hai vợ chồng nghèo đi ở cho phú ông, hiền lành chăm chỉ nhưng tuổi đã xế chiều mà chưa có mụn con.

Một hôm người vợ vào rừng đốn củi, trời nắng gắt khát nước quá, thấy một cái sọ dừa đựng nước mưa trong veo dưới gốc cây bèn bưng lên uống. Về nhà bà thụ thai, ít lâu sau sinh ra một đứa bé không tay không chân, tròn lông lốc như quả sọ dừa.

Bà toan vứt đi thì đứa bé cất tiếng nài nỉ:
— Mẹ ơi, con là con người đấy, mẹ đừng vứt con đi tội nghiệp!
Thương con, bà giữ lại nuôi và đặt tên là Sọ Dừa.

Lớn lên, Sọ Dừa xin mẹ sang chăn đàn bò cho nhà phú ông. Phú ông ngần ngừ, nhưng nghĩ không phải tốn cơm nhiều liền đồng ý. Kỳ lạ thay, ngày nào Sọ Dừa cũng lăn đàn bò lên núi, chiều lại lăn bò về, con nào con nấy béo mẫm đẫy đà.

Phú ông có ba cô con gái luân phiên mang cơm cho Sọ Dừa. Hai cô chị kiêu kỳ thường hắt hủi chàng. Chỉ có cô con gái út hiền thục, nết na luôn đối xử dịu dàng với Sọ Dừa. Một lần đem cơm đến núi, cô nghe thấy tiếng sáo du dương véo von, rón rén bước tới thấy một chàng trai tuấn tú khôi ngô đang nằm thổi sáo, nhưng khi cô bước tới thì lại chỉ thấy chàng Sọ Dừa tròn vo nằm đó. Cô út đem lòng thầm yêu trộm nhớ.

Hết mùa ở, Sọ Dừa về bảo mẹ sang hỏi cưới con gái phú ông. Phú ông thách cưới mâm vàng, xà cừ, lụa là gấm vóc. Không ngờ đúng hẹn, Sọ Dừa sắm đủ đồ sính lễ. Hai cô chị bĩu môi chê bai, chỉ có cô út vui vẻ bằng lòng gả cho chàng.

Đêm tân hôn, Sọ Dừa rũ bỏ lốt tròn, hiện nguyên hình là một chàng trai khôi ngô tuấn tú. Hai cô chị thấy thế vô cùng ghen tức.

Sọ Dừa ngày đêm miệt mài đèn sách và đỗ Trạng Nguyên rực rỡ. Trước khi lên đường đi sứ, chàng trao cho vợ một hòn đá lửa, một con dao nhỏ và hai quả trứng gà dặn luôn giữ bên mình phòng khi tai họa.

Ở nhà, hai người chị ganh ghét lừa rủ cô út chèo thuyền ra biển rồi xô cô xuống nước sâu. Một con cá kình khổng lồ nuốt cô vào bụng. Cô út dùng dao mổ bụng cá dạt vào một hòn đảo hoang, đánh lửa nướng thịt cá ăn sống qua ngày. Hai quả trứng gà nở thành hai chú gà con, sớm chiều gáy vang bầu bạn.

Một ngày nọ, đoàn thuyền sứ thần đi ngang qua đảo, chú gà trống bay lên mỏm đá gáy to:
"Ò... ó... o...
Phải thuyền quan Trạng rước cô tôi về!"

Quan Trạng Sọ Dừa ghé thuyền vào nhận ra vợ hiền. Vợ chồng đoàn tụ hạnh phúc, hai người chị xấu hổ bỏ xứ đi biệt tích.`
  },
  {
    id: 'vn-su-tich-trau-cau',
    title: 'Sự Tích Trầu Cau',
    category: 'Vietnam',
    iconEmoji: '🍃',
    readingTimeMinutes: 5,
    difficulty: 'Ý nghĩa',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Biểu tượng thiêng liêng của tình anh em keo sơn gắn bó và tình nghĩa vợ chồng thủy chung son sắt.',
    content: `Đời vua Hùng Vương, có hai anh em sinh đôi tên là Cao Tân và Cao Lang, giống nhau như hai giọt nước đến người nhà cũng khó phân biệt. Cha mẹ mất sớm, hai anh em cùng theo học cụ đồ Lưu ở vùng nọ.

Cụ đồ có người con gái nết na thùy mị. Thấy hai anh em hòa thuận hiếu học, cụ muốn gả con gái cho người anh. Nàng rót một bát cháo đưa mời, thấy người em nhường anh ăn trước, nàng nhận ra ai là anh và nên duyên vợ chồng cùng Cao Tân.

Từ khi lấy vợ, Cao Tân có phần ít trò chuyện chia sẻ với em như trước. Người em buồn rầu nghĩ anh không còn quý mình nữa.

Một buổi chiều, Lang đi làm đồng về mệt, Tân về sau ôm chầm lấy em vì ngỡ là vợ mình. Người vợ trong nhà bước ra nhìn thấy, Tân đỏ mặt ngượng ngùng. Lang cảm thấy bẽ bàng tủi thẹn, liền lặng lẽ ra đi trong đêm tối.

Lang đi mãi, đi mãi về phía nam, đến một bờ sông sâu nước chảy xiết không thể qua được. Chàng ngồi bên bờ đá ôm mặt khóc than cho đến khi kiệt sức chết đi, hóa thành một tảng đá vôi trắng sừng sững bên bờ nước.

Tân ở nhà đợi mãi không thấy em về, hối hận vô cùng liền từ biệt vợ đi tìm em. Chàng đi theo đúng con đường em đã đi, đến bờ sông thấy tảng đá vôi, lòng đau như cắt ôm tảng đá khóc cạn nước mắt rồi chết hóa thành một thân cây thẳng tắp, không cành, trên ngọn xòe ra từng chùm quả tròn nhỏ — đó chính là cây cau.

Người vợ ở nhà trông ngóng chồng mòn mỏi, cũng khăn gói lên đường tìm chồng. Đến bờ sông vắng, thấy cây cau mọc cạnh tảng đá, nàng ôm gốc cây cau khóc thương cho đến trút hơi thở cuối cùng, hóa thân thành một dây leo mềm mại quấn quýt quanh thân cau — đó là dây trầu không.

Ít lâu sau, vua Hùng đi tuần thú qua đó, nghe dân chúng kể lại câu chuyện cảm động bèn lấy lá trầu, nhai cùng quả cau và chút vôi từ tảng đá, thấy vị cay nồng ngọt ngào, miệng đỏ tươi thắm. Vua truyền cho dân nhân giống trầu cau, dùng trong lễ cưới hỏi để biểu trưng cho lòng thủy chung, gắn bó đời đời.`
  },
  {
    id: 'vn-cay-tre-tram-dot',
    title: 'Cây Tre Trăm Đốt',
    category: 'Vietnam',
    iconEmoji: '🎋',
    readingTimeMinutes: 6,
    difficulty: 'Ý nghĩa',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Ở hiền gặp lành, kẻ dối trá lừa gạt người lao động sẽ nhận lấy sự trừng phạt thích đáng.',
    content: `Ngày xưa có một chàng trai tên Khoai hiền lành, mồ côi cha mẹ, đi làm thuê cho một phú ông giàu có trong làng. Phú ông thấy anh khỏe mạnh, chịu thương chịu khó bèn hứa:
— Con cứ gắng sức làm lụng cho ta ba năm không lấy công, đến ngày mãn hạn ta sẽ gả con gái rượu cho con!

Anh Khoai mừng rỡ, không quản nắng mưa sớm hôm cày cuốc, vỡ ruộng đốn củi, làm cho kho lúa phú ông đầy ắp trâu bò chật chuồng.

Hết hạn ba năm, phú ông tiếc của lại chê anh nghèo, bèn ngấm ngầm nhận lời gả con gái cho một nhà giàu khác. Để đuổi anh Khoai đi, phú ông ngọt ngào bảo:
— Muốn cưới con gái ta, con phải lên rừng chặt cho ta một cây tre đủ đúng một trăm đốt để làm đũa ăn cưới!

Anh Khoai thật thà vác rựa lên rừng tìm kiếm. Anh đi hết quả đồi này qua ngọn núi nọ, đốn ngã biết bao nhiêu cây tre nhưng chẳng cây nào có nổi một trăm đốt; cây dài nhất cũng chỉ được bốn năm mươi đốt là cùng. Tuyệt vọng, anh ngồi dưới gốc cây ôm mặt khóc rưng rức.

Bỗng một làn sương trắng tỏa ra, ông Bụt râu tóc bạc phơ hiện lên hiền từ hỏi:
— Vì sao con khóc?
Anh Khoai nghẹn ngào kể lại đầu đuôi lời thách cưới của phú ông. Bụt mỉm cười bảo:
— Con hãy đi chặt cho ta đúng một trăm đốt tre riêng lẻ đem xếp lại đây!

Anh Khoai làm theo ngay. Bụt dạy anh đọc câu thần chú:
"Khắc nhập! Khắc nhập!"

Kỳ lạ thay, vừa dứt lời, một trăm đốt tre bỗng tự động dính chặt vào nhau nối dài thành một cây tre trăm đốt cao vút sừng sững. Anh Khoai mừng rỡ toan vác về nhưng cây tre quá dài không thể luồn qua rừng rậm. Bụt lại mỉm cười dạy thêm câu thần chú:
"Khắc xuất! Khắc xuất!"

Tức thì cây tre lại rời ra thành một trăm đốt tre nhỏ gọn. Anh Khoai cảm tạ Bụt rồi hồ hởi gánh trăm đốt tre trở về làng.

Về đến nhà, anh thấy rạp cưới đã dựng rộn ràng, phú ông đang chuẩn bị làm lễ gả con gái cho con trai nhà giàu. Thấy anh gánh tre về, phú ông cười nhạo báng:
— Ta bảo mày tìm cây tre một trăm đốt, chứ ai bảo mày mang một gánh củi tre về?

Anh Khoai không nói không rằng, đặt các đốt tre xuống sân rồi lẩm bẩm đọc:
"Khắc nhập! Khắc nhập!"

Ngay lập tức, trăm đốt tre ghép lại thành một cây tre dài chạm trời. Phú ông chạy lại toan giật ra thì dính chặt luôn vào thân tre. Tên thông gia nhà giàu chạy đến cứu cũng bị dính theo. Cả hai đau đớn van lạy xin anh Khoai tha mạng, hứa sẽ gả con gái và chia nửa gia tài cho anh.

Lúc bấy giờ anh Khoai mới thong thả đọc:
"Khắc xuất! Khắc xuất!"
Hai kẻ gian dối ngã lăn ra sân, sợ hãi cúi đầu nhận lỗi.

Đám cưới của anh Khoai và cô con gái phú ông diễn ra tưng bừng. Hai vợ chồng sống bên nhau hạnh phúc, chia sẻ lúa gạo cho dân nghèo trong làng.`
  },
  {
    id: 'vn-mai-an-tiem',
    title: 'Sự Tích Dưa Hấu (Mai An Tiêm)',
    category: 'Vietnam',
    iconEmoji: '🍉',
    readingTimeMinutes: 5,
    difficulty: 'Phiêu lưu',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Ý chí tự lực cánh sinh, bàn tay lao động cần cù sáng tạo sẽ biến hoang vu thành hoa trái ngọt lành.',
    content: `Vào đời vua Hùng Vương, có một chàng trai tên Mai An Tiêm, vốn thông minh, tháo vát và có tài ăn nói nên được nhà vua rất mực yêu quý, gả con gái nuôi và ban cho bổng lộc dồi dào.

Sống trong nhung lụa, An Tiêm vẫn khiêm tốn. Một lần trong yến tiệc, các quan đều khen của cải là ơn vua ban, riêng An Tiêm điềm đạm nói:
— Của biếu là lo, của cho là nợ; của cải do chính bàn tay ta làm ra mới thật là của mình.

Có kẻ ghen ghét đem lời ấy tâu lên vua, thêu dệt thành tội ngạo mạn bất kính. Nhà vua nổi giận lôi đình, truyền lệnh đày cả gia đình An Tiêm ra một hòn đảo hoang vu giữa biển Đông, chỉ cho mang theo một thanh gươm cùn và một ít gạo ăn vài ngày.

Đến đảo hoang mênh mông cát trắng sóng vỗ, người vợ ôm con khóc lóc lo sợ đói khát. An Tiêm vỗ về vợ con:
— Trời sinh voi sinh cỏ, chỉ cần đôi bàn tay ta còn khỏe mạnh, nhất định chúng ta sẽ sống!

Họ dựng lều bằng cành cây, An Tiêm dùng gươm đào củ mài, đánh bắt cá dưới biển, lấy nước ngọt từ khe đá nuôi gia đình qua ngày.

Một buổi trưa, An Tiêm thấy một đàn chim biển từ phương tây bay tới đậu trên bờ cát nhả ra mấy hạt màu đen nhánh. Thấy chim ăn được, An Tiêm liền gom hạt đem gieo xuống vùng đất màu mỡ sau lều và ngày ngày cần mẫn tưới nước ngọt.

Chẳng bao lâu sau, mầm xanh nhú lên, bò lan khắp mặt đất đơm hoa kết trái. Những quả dưa lớn nhanh như chiếc chum con, vỏ xanh thẫm trơn bóng. Khi bổ ra, ruột đỏ au, mọng nước, hạt đen nhánh, cắn thử một miếng thấy ngọt lịm, thanh mát sảng khoái vô cùng.

An Tiêm đặt tên cho quả là "dưa Tây" (sau này gọi là dưa hấu). Mỗi mùa thu hoạch, chàng chọn những quả to nhất, dùng mũi gươm khắc tên mình và đánh dấu rồi thả trôi theo dòng hải lưu về đất liền.

Dân chài ven biển vớt được dưa quý đem dâng vua Hùng. Nếm thử vị dưa ngon ngọt chưa từng có lại thấy tên Mai An Tiêm, nhà vua vô cùng kinh ngạc và khâm phục ý chí kiên cường, tài năng tự lập của chàng. Vua nhận ra lỗi lầm của mình, lập tức sai thuyền rước gia đình An Tiêm về triều phục hồi chức vị.

Mai An Tiêm đem hạt giống dưa hấu quý phân phát cho bà con khắp nơi gieo trồng, từ đó nước ta có giống dưa hấu thơm ngon ngọt lành lưu truyền muôn đời.`
  },
  {
    id: 'vn-banh-chung-banh-day',
    title: 'Bánh Chưng Bánh Dầy (Lang Liêu)',
    category: 'Vietnam',
    iconEmoji: '🎋',
    readingTimeMinutes: 5,
    difficulty: 'Ý nghĩa',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Tôn vinh hạt gạo nuôi sống con người, lòng hiếu thảo và nét đẹp truyền thống cội nguồn dân tộc.',
    content: `Vào đời Hùng Vương thứ sáu, sau khi đánh tan giặc Ân, đất nước thái bình, nhà vua tuổi đã cao muốn chọn người kế vị. Vua có hai mươi người con trai, ai cũng tài hoa văn võ.

Nhà vua bèn triệu tập các hoàng tử lại và phán:
— Tết năm nay, người nào tìm được món ăn ngon, có ý nghĩa nhất để cúng tế Trời Đất và tổ tiên thì ta sẽ truyền ngôi báu cho!

Các hoàng tử đua nhau sai người đi khắp rừng sâu biển thẳm, lặn lội tìm kiếm của ngon vật lạ: vây cá mập, nem công chả phượng, yến sào, sơn hào hải vị.

Riêng hoàng tử thứ mười tám là Lang Liêu, mồ côi mẹ từ nhỏ, tính tình hiền hậu, chất phác, sống gắn bó với đồng ruộng lúa ngô. Chàng vô cùng lo lắng vì nhà nghèo, không biết lấy gì làm lễ vật dâng vua cha.

Một đêm nọ, Lang Liêu nằm mộng thấy một vị Thần râu tóc bạc phơ hiện ra bảo:
— Này con, trong trời đất không có vật gì quý bằng hạt gạo, vì hạt gạo nuôi sống con người. Con hãy lấy gạo nếp làm thành hai thứ bánh: một thứ bánh hình tròn tượng trưng cho Trời, một thứ bánh hình vuông tượng trưng cho Đất. Ở trong nhân hãy đặt đậu xanh, thịt lợn tượng trưng cho muôn loài muông thú sinh sôi nảy nở.

Tỉnh dậy, Lang Liêu mừng rỡ làm theo lời Thần dạy. Chàng chọn những hạt nếp cái hoa vàng thơm dẻo nhất, vo sạch; lấy lá dong xanh mướt gói nhân đậu xanh và thịt lợn ở giữa thành chiếc bánh vuông vức, buộc bằng lạt giang rồi cho vào nồi nấu suốt một ngày đêm. Đó là bánh chưng tượng trưng cho Đất mẹ bao la. Chàng lại lấy nếp đồ chín giã thật nhuyễn, nặn thành hình tròn mịn màng trắng nõn tượng trưng cho Trời xanh. Đó là bánh dầy.

Đến ngày hội thi, các hoàng tử mang đến vô vàn mâm cỗ sơn hào hải vị lộng lẫy. Đến lượt Lang Liêu, chàng chỉ dâng lên hai mâm bánh mộc mạc, tỏa hương nếp thơm dìu dịu.

Vua nếm thử tấm tắc khen ngợi, rồi hỏi về ý nghĩa của món ăn. Lang Liêu đem giấc mơ và lời giải thích về Trời Đất dâng lên vua cha. Nhà vua vô cùng xúc động, phán:
— Bánh của Lang Liêu vừa ngon, vừa ý nghĩa, lại thể hiện được công ơn trời đất sinh thành và tấm lòng thơm thảo của người làm nông nghiệp.

Vua Hùng chấm lễ vật của Lang Liêu giải nhất và truyền ngôi báu cho chàng. Kể từ đó, mỗi dịp Tết đến xuân về, người dân Việt Nam ta đều gói bánh chưng bánh dầy cúng tổ tiên, nhắc nhở con cháu về đạo lý uống nước nhớ nguồn.`
  },
  {
    id: 'vn-tri-khon-cua-ta-day',
    title: 'Trí Khôn Của Ta Đây',
    category: 'Vietnam',
    iconEmoji: '🐅',
    readingTimeMinutes: 4,
    difficulty: 'Ngụ ngôn',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Sức mạnh cơ bắp không thể thắng được trí tuệ và sự mưu trí của con người.',
    content: `Một buổi trưa hè oi ả, một bác nông dân cùng một con trâu to lớn đang cặm cụi cày ruộng dưới nắng gắt. Con trâu to khỏe phục tùng từng lời quát của bác nông dân, ngoan ngoãn kéo cày từng luống thẳng tắp.

Từ trong bìa rừng rậm, một con hổ to lớn rón rén bước ra nhìn thấy cảnh ấy lấy làm lạ lùng lắm. Chờ lúc bác nông dân nghỉ tay ngồi uống nước dưới bóng cây đa, hổ ta mon men lại gần con trâu và cất giọng thì thầm:
— Này anh trâu! Anh to lớn khỏe mạnh như thế, cớ sao lại để một người bé nhỏ gầy gò bắt anh làm lụng cực nhọc, lại còn quất roi vào mông anh nữa?

Trâu thủng thỉnh đáp:
— Người tuy nhỏ bé nhưng người có trí khôn, hổ ạ!

Hổ chẳng hiểu "trí khôn" là cái gì, tò mò lắm, liền tiến lại gần bác nông dân và hỏi:
— Này người! Trí khôn của ngươi ở đâu, hãy lấy ra cho ta xem một chút có được không?

Bác nông dân thoạt đầu giật mình nhưng nhanh trí mỉm cười bảo:
— Trí khôn của ta để quên ở nhà rồi!
Hổ gầm gừ bảo:
— Thế ngươi về lấy trí khôn ra đây cho ta xem ngay đi!

Bác nông dân vờ ái ngại bảo:
— Nhưng nếu ta về lấy, lỡ ngươi ở đây ăn thịt mất trâu của ta thì sao? Nếu ngươi ưng thuận để ta buộc ngươi vào gốc cây này cho chắc chắn, ta sẽ về lấy trí khôn cho ngươi xem ngay!

Hổ nghĩ bụng được xem trí khôn thì chịu trói một lát cũng chẳng sao, liền gật đầu đồng ý. Bác nông dân lấy dây thừng bện thật chắc, trói chặt hổ vào một gốc cây to. Xong xuôi, bác lấy rơm khô chất quanh gốc cây, châm lửa đốt và cầm đòn cày quất vào hổ vừa quát to:
— Trí khôn của ta đây! Trí khôn của ta đây!

Lửa cháy bập bùng làm cháy sém cả bộ lông vàng mượt của hổ. Hổ đau đớn gầm rú vang động cả núi rừng, giãy giụa hết sức may sao làm đứt dây thừng rồi cắm đầu cắm cổ chạy thục mạng vào rừng sâu, không bao giờ dám bén mảng đến gần con người nữa.

Từ đó về sau, trên mình loài hổ bao giờ cũng có những vệt sọc đen dài, đó chính là dấu tích vết cháy sém của ngọn lửa "trí khôn" năm xưa.`
  },
  {
    id: 'vn-coc-kien-troi',
    title: 'Cóc Kiện Trời',
    category: 'Vietnam',
    iconEmoji: '🐸',
    readingTimeMinutes: 5,
    difficulty: 'Ngụ ngôn',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Dám đứng lên đấu tranh cho lẽ phải, đoàn kết muôn loài tạo nên sức mạnh dời non lấp biển.',
    content: `Năm ấy hạn hán kéo dài đến ba năm liền. Đồng ruộng nứt nẻ chân chim, sông hồ cạn trơ đáy cát, cây cối héo úa rũ rượi, muôn loài khát khô cổ họng sắp chết đói chết khát.

Thấy cảnh tượng thê thảm, chú Cóc tía da sần sùi quyết tâm lên thiên đình kiện Ngọc Hoàng đòi mưa cứu muôn loài.

Dọc đường đi, Cóc gặp Cua, Ong, Cáo, Gấu và Cọp. Nghe Cóc nói chuyện đi kiện Trời, chúng đều tán thành và xin đi theo. Cóc vui vẻ nhận lời kết đoàn cùng tiến bước.

Đến cửa nhà Trời, Cóc thấy một cái trống to đùng đặt trước sân rồng bèn bảo:
— Cua hãy vào nấp trong chum nước cạnh cửa. Ong nấp sau cánh cửa. Cáo, Gấu và Cọp nấp hai bên hành lang. Còn tôi sẽ nhảy lên mặt trống gióng ba hồi vang dội.

Cóc cầm dùi trống đánh thùng thùng vang dội. Tiếng trống làm chấn động cả thiên đình. Ngọc Hoàng giận dữ sai gà thần ra mổ chết Cóc. Gà vừa bước ra, Cóc ra hiệu cho Cáo xông ra cắn chết gà. Ngọc Hoàng lại sai Chó thần ra cắn Cáo. Cọp liền nhảy chồm ra vồ chết Chó thần.

Ngọc Hoàng đùng đùng nổi giận sai Thiên Lôi cầm búa sét ra trừng trị. Thiên Lôi hùng hổ xông ra thì bị bầy Ong bay túa ra đốt túi bụi vào mặt. Thiên Lôi hoảng hốt nhảy tọt vào chum nước tránh ong thì bị Cua kẹp chặt vào mũi đau điếng. Thiên Lôi giãy giụa chạy ngược vào cung sụp lạy kêu cứu.

Bấy giờ Ngọc Hoàng biết không thể coi thường chú Cóc gan dạ bèn truyền mời Cóc vào giảng hòa. Cóc đĩnh đạc tâu:
— Muôn tâu Ngọc Hoàng! Dưới hạ giới ba năm nay không có một giọt mưa, muôn loài khổ sở chết dần chết mòn. Kính xin Ngọc Hoàng mau chóng ban mưa cứu vớt sinh linh!

Ngọc Hoàng nhìn xuống trần gian thấy cảnh hạn hán xót xa, bèn sai Thần Mưa lập tức làm mưa tưới mát khắp hạ giới, sông suối đầy nước, lúa ngô lại xanh rờn tươi tốt.

Trước khi tiễn Cóc về, Ngọc Hoàng dặn dò thân mật:
— Từ nay hễ dưới trần gian có hạn hán, bác Cóc chỉ cần nghiến răng ken két báo hiệu là ta sẽ lập tức cho mưa xuống, không cần phải nhọc công lên đây nữa!

Bởi vậy dân gian mới có câu đồng dao truyền tụng:
"Con Cóc là cậu ông Trời
Hễ ai đánh Cóc thì Trời đánh cho!"`
  },
  {
    id: 'vn-su-tich-cay-vu-sua',
    title: 'Sự Tích Cây Vú Sữa',
    category: 'Vietnam',
    iconEmoji: '🍈',
    readingTimeMinutes: 5,
    difficulty: 'Ý nghĩa',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Tình mẹ bao la như biển thái sơn; hãy yêu thương và hiếu thảo với cha mẹ khi còn có thể.',
    content: `Ngày xưa có một cậu bé rất được mẹ nuông chiều. Vì được nuông chiều nên cậu sinh ra ngỗ nghịch và ham chơi. Một lần bị mẹ mắng vì mải chơi bỏ bữa, cậu vùng vằng giận dỗi bỏ nhà chạy một mạch đi mất.

Cậu lang thang khắp nơi, ai cho gì ăn nấy, chẳng nghĩ gì đến người mẹ đang ngày đêm mong ngóng ở nhà.

Ở nhà, người mẹ đau đớn khóc cạn cả nước mắt, ngày ngày ra ngõ tựa cửa trông con, sức tàn lực kiệt rồi ngã quỵ xuống đất.

Mùa đông đến, gió bấc lạnh buốt căm căm, cậu bé vừa đói vừa rét lại bị những đứa trẻ lớn hơn bắt nạt. Lúc bấy giờ cậu mới nhớ đến hơi ấm của mẹ, nhớ bát cơm nóng mẹ nấu, nhớ bàn tay mẹ âu yếm xoa đầu. Cậu liền tìm đường lần mò quay về nhà.

Về đến nơi, cảnh vật vẫn như xưa nhưng nhà cửa vắng tanh, mạng nhện giăng đầy, cỏ dại mọc lút lối đi. Cậu cất tiếng gọi mẹ thất thanh:
— Mẹ ơi! Mẹ ở đâu, con đã về với mẹ rồi đây!

Không có tiếng trả lời. Quá mệt mỏi và ân hận, cậu bé gục xuống ôm lấy một thân cây xanh tốt mọc bên hiên nhà mà khóc nức nở.

Bỗng nhiên, thân cây rung rinh nhè nhẹ. Cành lá xòe rộng ra che chở cho cậu, từ các kẽ lá những chồi non nảy nở, đơm hoa trắng tinh thơm ngát. Hoa tàn, quả xuất hiện, lớn nhanh như thổi, da căng mịn màng óng ả. Một quả chín mọng tự động rụng vào lòng bàn tay cậu bé.

Cậu đưa lên miệng cắn nhẹ, một dòng sữa trắng thơm ngọt ngào tuôn trào như dòng sữa mẹ ngọt lành năm nào. Cậu bé vừa uống vừa khóc ròng, nhìn lên tán lá: một mặt lá xanh bóng, mặt kia đỏ hoe như đôi mắt người mẹ khóc trông con mòn mỏi. Cành cây ngả nghiêng vỗ về cậu như cánh tay mẹ chở che năm tháng.

Cậu bé khóc toáng lên xin lỗi mẹ nhưng mẹ cậu đã không còn nữa, bà đã hóa thân thành cây xanh nuôi dưỡng chở che cậu đến muôn đời.

Dân làng thấy giống quả thơm ngọt kỳ lạ liền đem hạt nhân giống khắp nơi, đặt tên là "Cây Vú Sữa".`
  },
  {
    id: 'vn-chu-cuoi-cung-trang',
    title: 'Chú Cuội Cung Trăng',
    category: 'Vietnam',
    iconEmoji: '🌙',
    readingTimeMinutes: 5,
    difficulty: 'Ý nghĩa',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Giải thích hình ảnh chú Cuội ngồi gốc cây đa trên mặt trăng vào đêm rằm Trung Thu.',
    content: `Ngày xưa có một chàng tiều phu tên là Cuội. Một hôm như thường lệ, Cuội vác rìu vào rừng sâu đốn củi. Khi đến gần một hang đá, Cuội tình cờ thấy bốn chú hổ con đang vờn nhau trước cửa hang. Cuội liền xông đến bắt lấy hổ con.

Đúng lúc đó hổ mẹ tha mồi trở về. Nghe tiếng gầm dữ dội, Cuội hoảng hốt quẳng rìu leo tót lên một cây cao ẩn nấp. Hổ mẹ thấy bầy con nằm thoi thóp liền chạy vội đến một gốc cây gần đó, nhai mấy búp lá non rồi mớm vào miệng cho đàn con. Kỳ lạ thay, vừa nhai xong búp lá, đàn hổ con đã chớp mắt, đứng dậy vẫy đuôi mừng rỡ như chưa từng có chuyện gì xảy ra.

Đợi cọp mẹ dắt đàn con đi xa, Cuội liền tụt xuống đào bới lấy cả gốc cây thuốc quý đem về trồng ở góc vườn nhà.

Từ ngày có cây thuốc cải tử hoàn sinh, Cuội cứu sống được vô số người bệnh và loài vật. Chàng cứu một con chó bị trôi sông, con chó quấn quýt trung thành với chàng suốt ngày đêm. Chàng còn cứu sống được một cô gái con nhà phú ông vừa qua đời, người cha cảm phục gả con gái cho Cuội làm vợ.

Vợ chồng Cuội sống ấm êm, nhưng người vợ chẳng may mắc chứng hay quên. Cuội dặn vợ trăm lần:
— Có tưới cây thì tưới bằng nước suối trong veo, chớ tưới nước bẩn kẻo cây bay lên trời mất đấy!

Một hôm Cuội vắng nhà, người vợ quên khuấy lời dặn, đem gáo nước bẩn tưới vào gốc cây thần. Ngay lập tức, mặt đất rung chuyển ầm ầm, rễ cây đứt phựt và cây thuốc thần từ từ bay lơ lửng lên không trung.

Vừa lúc Cuội đi rừng về tới sân, thấy cây thuốc quý bay lên, Cuội hốt hoảng vứt cả gánh củi, nhảy chồm tới bám chặt vào rễ cây định lôi lại. Nhưng sức người không cản nổi phép mầu, cây thần cứ thế bay vút lên cao, mang theo cả chú Cuội bay thẳng qua tầng mây trắng lên tận mặt trăng.

Từ đó về sau, Cuội phải ở lại mãi mãi trên cung trăng cùng cây thuốc quý. Mỗi đêm rằm Trung Thu sáng trong vằng vặc, khi các em nhỏ ngước nhìn lên mặt trăng sẽ thấy rõ hình bóng một cây cổ thụ sum sê và một chú Cuội ngồi ủ rũ nhớ quê hương làng mạc dưới trần gian.`
  },
  {
    id: 'vn-thay-boi-xem-voi',
    title: 'Thầy Bói Xem Voi',
    category: 'Vietnam',
    iconEmoji: '🐘',
    readingTimeMinutes: 4,
    difficulty: 'Ngụ ngôn',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Muốn hiểu thấu đáo sự vật phải quan sát toàn diện, chớ vội quy kết phiến diện từ cái nhìn hạn hẹp.',
    content: `Nhân một buổi chợ phiên vắng khách, năm ông thầy bói mù ngồi tán gẫu với nhau. Thầy nào cũng phàn nàn là từ thuở cha sinh mẹ đẻ đến giờ chưa từng biết hình thù con voi nó ngang dọc ra sao. Bỗng nghe người ta kháo nhau có người đang dắt một con voi đi qua chợ, năm thầy bói bèn chung tiền biếu người quản voi xin cho voi đứng lại để các thầy được tận tay sờ xem.

Thầy thứ nhất sờ vào cái vòi voi, bèn gật gù bảo:
— Tưởng voi thế nào, hóa ra nó sun sun như con đỉa ấy!

Thầy thứ hai sờ vào cái ngà sắc nhọn, gạt phắt đi:
— Không phải! Nó chần chẫn như cái đòn càn đập lúa ấy chứ!

Thầy thứ ba sờ vào cái tai to bản phe phẩy, cãi lại:
— Hai thầy nói đều sai cả! Voi nó bè bè như cái quạt thóc quạt lúa đây này!

Thầy thứ tư sờ vào cái chân to khỏe, bĩu môi:
— Ai bảo! Nó sừng sững như cái cột đình chống sét thì có!

Thầy thứ năm túm lấy cái đuôi ngoe nguẩy ở phía sau, quát to:
— Các thầy chẳng biết gì hết! Con voi nó tua tủa như chiếc chổi sể cùn quét bếp!

Năm thầy ai cũng cho là mình đúng, không ai chịu nhường ai. Thầy nọ mắng thầy kia dốt nát mù quáng, rồi xông vào túm tóc cào cấu, đánh nhau toác đầu chảy máu làm náo động cả góc chợ.

Câu chuyện châm biếm sâu sắc thói nhìn nhận sự việc một cách phiến diện, chủ quan, chỉ thấy một bộ phận nhỏ mà ngỡ đã thấu tỏ toàn bộ thế giới.`
  },
  {
    id: 'vn-ech-ngoi-day-gieng',
    title: 'Ếch Ngồi Đáy Giếng',
    category: 'Vietnam',
    iconEmoji: '🐸',
    readingTimeMinutes: 3,
    difficulty: 'Ngụ ngôn',
    ageRange: 'Mọi lứa tuổi',
    moral: 'Luôn giữ tinh thần khiêm nhường học hỏi, tránh thói kiêu ngạo tự phụ vì hiểu biết nông cạn.',
    content: `Có một con ếch sống lâu ngày trong một cái giếng cạn nhỏ hẹp. Xung quanh nó chỉ có vài con cua, con ốc, con nhái bé tí tẹo. Mỗi lần ếch cất tiếng kêu "ộp ộp" vang dội khắp đáy giếng chật chội, các con vật bé nhỏ xung quanh đều sợ hãi run rẩy. Vì thế, ếch cứ ngỡ mình là một vị chúa tể oai phong lẫm liệt nhất trần đời.

Hằng ngày từ đáy giếng ngước nhìn lên miệng giếng, ếch chỉ thấy một khoảng trời tròn xoe như cái vung nồi. Nó đinh ninh bầu trời bên ngoài cũng chỉ to bằng chừng ấy và không ai tài giỏi hơn mình.

Một năm nọ, trời đổ mưa rào xối xả làm nước trong giếng dâng cao lênh láng. Nước đưa ếch trôi bồng bềnh ra khỏi miệng giếng bước ra thế giới rộng lớn bên ngoài.

Quen thói huênh hoang, ếch nghênh ngang đi lại dọc đường cái, ngẩng mặt lên trời cất tiếng kêu ồm ộp và chẳng thèm để ý gì đến xung quanh. Nó nghĩ muôn loài trên mặt đất cũng phải sợ hãi né tránh mình như lũ cua ốc dưới giếng.

Đúng lúc đó, một bác trâu mộng đang kéo xe đi tới. Vì mải nghếch mắt nhìn trời kiêu ngạo, ếch ta không nhìn thấy trâu nên đã bị móng chân trâu giẫm bẹp dí.

Bài học nhắc nhở mỗi chúng ta cần mở rộng tầm nhìn, luôn khiêm tốn học hỏi những điều mới mẻ trong cuộc sống.`
  },

  // --- TRUYỆN CỔ THẾ GIỚI & ANDERSEN & GRIMM ---
  {
    id: 'wd-co-be-ban-diem',
    title: 'Cô Bé Bán Diêm',
    category: 'Andersen',
    iconEmoji: '🕯️',
    readingTimeMinutes: 6,
    difficulty: 'Ý nghĩa',
    ageRange: 'Mọi lứa tuổi',
    author: 'Hans Christian Andersen (Đan Mạch)',
    moral: 'Lòng trắc ẩn, tình yêu thương và sự sẻ chia đối với những số phận nghèo khó, bất hạnh.',
    content: `Đêm giao thừa, tuyết rơi dày đặc trên khắp các ngả đường phố. Gió bấc thổi từng cơn lạnh buốt thấu xương. Giữa bóng tối mịt mùng, một cô bé đầu trần, chân đi đất run rẩy dạo bước trên hè phố.

Mẹ em đã mất sớm, người bà hiền từ thương yêu em nhất cũng đã qua đời. Em chỉ còn người cha nghèo khó, suốt ngày mắng mỏ nếu em không bán được bao diêm nào mang tiền về.

Suốt cả ngày hôm đó, người ta tấp nập qua lại mua sắm chuẩn bị đón năm mới nhưng chẳng có ai mảy may đoái hoài mua cho em lấy một que diêm. Em đói lả, đôi bàn chân đỏ ửng rồi tím ngắt vì tuyết lạnh. Từ các ô cửa sổ sáng đèn ven đường, mùi ngỗng quay thơm nức bay ra làm cồn cào ruột gan cô bé.

Em nép mình vào một góc tường giữa hai ngôi nhà để tránh gió. Đôi tay em tê cóng. Em đánh liều quẹt một que diêm vào tường để sưởi ấm ngón tay.

Xoẹt! Một ngọn lửa xanh bùng lên rồi biến thành ánh sáng vàng rực rỡ, ấm áp lạ kỳ. Trong ánh sáng que diêm, em thấy mình đang ngồi trước một chiếc lò sưởi bằng đồng sáng bóng với ngọn lửa hồng reo vui nhảy múa. Em vừa duỗi đôi chân ra để sưởi ấm thì diêm tắt phụt, lò sưởi biến mất, chỉ còn lại bức tường lạnh lẽo phủ tuyết.

Em quẹt que diêm thứ hai. Bức tường bỗng biến thành tấm màn trong suốt. Em nhìn thấy bên trong một căn phòng lộng lẫy, trên bàn ăn phủ khăn trắng muốt có một con ngỗng quay thơm phức cắm dao nĩa đang nhảy ra khỏi đĩa tiến về phía em. Rồi diêm tắt, trước mắt em lại là màn đêm u tối.

Em quẹt que diêm thứ ba. Một cây thông Noel khổng lồ hiện ra với hàng ngàn ngọn nến lung linh và những bức tranh màu rực rỡ treo trên cành lá xanh tươi. Khi em vươn tay tới, diêm tắt, những ngọn nến bay vút lên bầu trời biến thành những vì sao lấp lánh. Một ngôi sao băng vụt rơi, vạch một vệt sáng dài trên bầu trời đêm. Em nhớ lời bà dặn: "Khi một vì sao rơi, một linh hồn đang bay về với Chúa".

Em quẹt que diêm thứ tư. Trong luồng sáng chói lọi hiện ra người bà kính yêu, hiền hậu và mỉm cười dịu dàng với em.
— Bà ơi! — Cô bé reo lên — Cho cháu đi với bà! Cháu biết khi diêm tắt bà sẽ biến mất như lò sưởi và con ngỗng quay!

Để giữ bà lại, cô bé vội quẹt hết tất cả những que diêm còn lại trong bao. Ánh sáng bừng lên rực rỡ hơn cả ban ngày. Người bà dang rộng vòng tay ôm chặt lấy em vào lòng. Hai bà cháu cùng bay vút lên cao, vượt qua đói rét và đau buồn của cõi trần để đến một nơi tràn ngập niềm vui và hạnh phúc bất tận.

Sáng mùng một đầu năm, tuyết trắng xóa phủ đầy góc phố. Mọi người nhìn thấy một cô bé nhỏ nhắn nằm cạnh đống que diêm đã cháy hết, đôi má ửng hồng và nụ cười thanh thản trên môi. Ai cũng xót xa: "Chắc nó muốn sưởi ấm!", nhưng không ai biết được những điều kỳ diệu tuyệt đẹp mà em và bà đã nhìn thấy trong đêm giao thừa thiêng liêng.`
  },
  {
    id: 'wd-nang-tien-ca',
    title: 'Nàng Tiên Cá',
    category: 'Andersen',
    iconEmoji: '🧜‍♀️',
    readingTimeMinutes: 8,
    difficulty: 'Phiêu lưu',
    ageRange: 'Mọi lứa tuổi',
    author: 'Hans Christian Andersen',
    moral: 'Tình yêu vị tha cao thượng, lòng dũng cảm theo đuổi ước mơ và tâm hồn thuần khiết.',
    content: `Nơi đáy đại dương sâu thẳm, nước xanh biếc như cánh hoa ngô và trong veo như pha lê, có một tòa lâu đài nguy nga của Vua Biển. Nhà vua có sáu nàng công chúa tiên cá xinh đẹp, nhưng nàng út là người đẹp nhất với làn da trắng mịn như cánh hoa hồng và đôi mắt xanh sâu thẳm như đại dương.

Khác với các chị, nàng tiên cá út say mê nghe bà kể về thế giới loài người trên mặt đất — nơi có những cánh rừng xanh ngát, những bông hoa tỏa ngát hương thơm và tiếng chim hót véo von.

Năm mười lăm tuổi, nàng được phép nổi lên mặt nước ngắm nhìn thế giới. Đêm ấy, nàng nhìn thấy một chiếc tàu buồm lộng lẫy đang mở tiệc ca hát. Trên tàu có một chàng hoàng tử trẻ tuổi khôi ngô đang mỉm cười rạng rỡ.

Bỗng một cơn bão kinh hoàng ập tới xé toạc cánh buồm, sóng biển cuồn cuộn đánh chìm con tàu. Nhìn thấy hoàng tử rơi xuống biển sâu ngất lịm, nàng tiên cá liền dũng cảm bơi vào giữa những mảnh vỡ, nâng chàng lên khỏi mặt nước và bơi suốt đêm đưa chàng vào bờ cát cạnh một tu viện rồi mới lặng lẽ ẩn mình dưới sóng biển.

Từ đó, hình bóng chàng hoàng tử không bao giờ phai mờ trong tâm trí nàng. Nàng khao khát có được đôi chân như con người để lên mặt đất và có được một linh hồn bất tử.

Nàng tìm đến hang động u tối của mụ phù thủy biển. Mụ phù thủy đồng ý chế cho nàng liều thuốc biến đuôi cá thành đôi chân con người, nhưng cảnh báo: mỗi bước đi của nàng sẽ đau đớn như dẫm lên lưỡi dao sắc nhọn, và nếu hoàng tử lấy người khác làm vợ, trái tim nàng sẽ tan vỡ thành bọt biển. Đổi lại, nàng phải đưa cho mụ giọng hát trong trẻo ngọt ngào nhất thế gian của mình.

Nàng tiên cá chấp nhận hy sinh giọng hát, uống cạn chén thuốc và ngất lịm trên bãi cát. Khi tỉnh dậy, nàng thấy hoàng tử đang đứng trước mặt mỉm cười nâng nàng dậy.

Hoàng tử đưa nàng về hoàng cung, cho nàng mặc những bộ xiêm y lộng lẫy nhất. Dù mỗi bước khiêu vũ đau nhói như dẫm trên gai nhọn, nàng vẫn mỉm cười nhảy múa duyên dáng mê đắm lòng người. Chàng hoàng tử yêu mến nàng như một người em gái bé nhỏ nhưng chàng lại lầm tưởng người con gái tu viện bên bờ biển năm xưa mới chính là ân nhân cứu mạng mình.

Ngày hôn lễ của hoàng tử và nàng công chúa nước láng giềng diễn ra tưng bừng trên chiếc du thuyền lộng lẫy, tim nàng tiên cá như thắt lại. Đêm đó, khi mọi người say giấc, các chị của nàng tiên cá nổi lên mặt nước, mái tóc dài óng ả đã bị cắt trụi đưa cho nàng một con dao sắc nhọn:
— Chúng em đã đổi tóc lấy con dao này từ mụ phù thủy! Trước khi mặt trời mọc, em hãy đâm con dao này vào tim hoàng tử, máu chàng rơi xuống chân em sẽ hóa lại thành đuôi cá và em sẽ được trở về với biển cả!

Nàng tiên cá cầm dao bước vào phòng ngủ của hoàng tử. Nhìn khuôn mặt hiền từ đang mỉm cười ngủ say của người mình yêu, nàng cúi xuống hôn nhẹ lên trán chàng rồi ném con dao sắc xuống biển sâu.

Khi ánh bình minh đầu tiên rạng rỡ le lói chân trời, nàng gieo mình xuống làn sóng biếc. Cơ thể nàng tan biến thành những bọt biển trắng lấp lánh. Nhưng nàng không biến mất trong hư vô, mà bay bổng lên không trung cùng những nàng tiên gió dịu dàng, tiếp tục hành trình gieo mầm hạnh phúc và tình yêu thương khắp thế gian.`
  },
  {
    id: 'wd-vit-con-xau-xi',
    title: 'Vịt Con Xấu Xí',
    category: 'Andersen',
    iconEmoji: '🦢',
    readingTimeMinutes: 6,
    difficulty: 'Ý nghĩa',
    ageRange: 'Mọi lứa tuổi',
    author: 'Hans Christian Andersen',
    moral: 'Vẻ đẹp đích thực nằm ở phẩm chất bên trong; kiên nhẫn vượt qua nghịch cảnh để tỏa sáng rực rỡ.',
    content: `Dưới bóng râm mát rượi của những bụi cây dại cạnh con hào quanh trang trại cũ, một chị vịt mẹ đang kiên nhẫn ấp một ổ trứng.

Cuối cùng, từng quả trứng bắt đầu kêu lách tách và nứt vỏ. Những chú vịt con vàng óng xinh xắn lần lượt thò đầu ra kêu "chíp chíp". Nhưng quả trứng to nhất ở giữa ổ mãi không chịu nở.

Mấy ngày sau, quả trứng to mới nứt vỏ. Một chú vịt to tướng, lông màu xám xịt vụng về bước ra. Cả đàn vịt, đàn gà trong trang trại xúm lại chê bai:
— Trông nó xấu xí kỳ dị làm sao! Chẳng giống giống nòi nhà ai cả!

Từ ngày đó, chú vịt con xám xịt trở thành đối tượng bị cả sân gia cầm trêu chọc, xua đuổi. Chú vịt con buồn bã, tủi thân liền nhảy qua hàng rào bỏ trốn đi tìm nơi dung thân.

Chú lưu lạc khắp nơi, trốn tránh lũ chó săn, trải qua mùa thu lá rụng vàng rồi đến mùa đông băng giá lạnh thấu xương. Nước hồ đóng băng, chú vịt bị kẹt cứng trong băng tuyết may nhờ một bác nông dân tốt bụng đập vỡ tảng băng cứu mang về nhà. Nhưng lũ trẻ trong nhà đuổi bắt làm chú sợ hãi lại chui qua cửa trốn ra ngoài trời giá rét.

Cả mùa đông dài dằng dặc, chú vịt con phải co ro dưới đống cỏ khô để chống chọi với cái lạnh và đói.

Thế rồi mùa xuân ấm áp cũng trở lại. Ánh nắng chan hòa chiếu rọi mặt nước trong veo, hoa cỏ đua nhau khoe sắc. Vịt con đập đôi cánh của mình, ngạc nhiên thấy cánh mình bây giờ đã vươn dài, khỏe khoắn lạ thường.

Chú đáp xuống một hồ nước trong mát rợp bóng liễu. Từ trong bụi rậm, ba con thiên nga trắng muốt tuyệt đẹp kiêu hãnh bơi ra. Vịt con tự ti nghĩ: "Ta sẽ bơi đến với những sinh vật hoàng gia kia, dẫu họ có mổ chết ta vì ta xấu xí thì vẫn hơn chịu đựng sự xua đuổi nhục nhã này".

Chú bơi lại gần cúi đầu chờ đợi sự trừng phạt. Bỗng chú nhìn xuống mặt nước trong veo như gương và sững sờ kinh ngạc:
Bóng hình phản chiếu dưới làn nước xanh biếc không còn là một chú vịt con xám xịt vụng về nữa, mà là một chú Thiên Nga trắng ngần kiêu hãnh, với chiếc cổ dài duyên dáng và đôi cánh trắng muốt hoàn hảo!

Những đứa trẻ trong vườn chạy ra tung bánh mì xuống hồ reo hò:
— Nhìn kìa! Có một chú thiên nga mới đến! Chú này là chú đẹp nhất trong tất cả!

Chú thiên nga trẻ ngượng ngùng giấu đầu dưới cánh, lòng tràn ngập niềm hạnh phúc vô bờ. Giờ đây chú mới hiểu: "Chỉ cần sinh ra từ một quả trứng thiên nga, thì dẫu có từng nằm trong ổ vịt cũng chẳng sao cả!"`
  },
  {
    id: 'wd-bach-tuyet-va-bay-chu-lun',
    title: 'Bạch Tuyết Và 7 Chú Lùn',
    category: 'Grimm',
    iconEmoji: '🍎',
    readingTimeMinutes: 7,
    difficulty: 'Phiêu lưu',
    ageRange: 'Mọi lứa tuổi',
    author: 'Anh em Grimm (Đức)',
    moral: 'Cái đẹp chân chính đi cùng lòng nhân ái sẽ luôn được bảo bọc; thói ghen ghét đố kỵ tự chuốc lấy diệt vong.',
    content: `Vào một ngày mùa đông tuyết rơi trắng xóa, một bà hoàng hậu ngồi thêu bên khung cửa sổ bằng gỗ mun. Vô tình kim châm vào tay, ba giọt máu đỏ rơi xuống nền tuyết trắng. Thấy vậy, hoàng hậu thầm ước: "Ước gì ta sinh được một cô con gái có làn da trắng như tuyết, đôi môi đỏ như máu và mái tóc đen như gỗ mun".

Chẳng bao lâu sau, ước mơ thành hiện thực, nàng công chúa chào đời được đặt tên là Bạch Tuyết. Nhưng khi công chúa vừa ra đời thì hoàng hậu qua đời.

Một năm sau, nhà vua lấy một người vợ mới vô cùng xinh đẹp nhưng tính tình kiêu ngạo, độc ác và luôn có lòng ghen ghét đố kỵ. Mụ hoàng hậu có một chiếc gương thần. Hằng ngày mụ đứng trước gương hỏi:
— Gương kia ngự ở trên tường
Thế gian ai đẹp được dường như ta?
Gương thần luôn trả lời:
— Xưa kia bà đẹp nhất trần
Ngày nay Bạch Tuyết muôn phần đẹp hơn!

Hoàng hậu nổi cơn thịnh nộ, sai một bác thợ săn đưa Bạch Tuyết vào rừng sâu giết chết đem tim về làm bằng chứng. Nhưng trước vẻ đẹp ngây thơ trong sáng của công chúa, bác thợ săn mủi lòng thả nàng đi và giết một con lợn rừng đem tim về dâng mụ hoàng hậu.

Bạch Tuyết bơ vơ giữa rừng rậm âm u hoang vắng. Nàng chạy mãi cho đến khi nhìn thấy một ngôi nhà gỗ nhỏ nhắn xinh xắn bên bờ suối. Trong nhà mọi thứ đều ngăn nắp, nhỏ xíu: một chiếc bàn có bảy chiếc đĩa nhỏ, bảy chiếc cốc nhỏ và bảy chiếc giường xinh xắn. Vì quá đói và mệt, nàng ăn một chút súp rồi nằm ngủ thiếp đi trên chiếc giường thứ bảy.

Chiều tối, chủ nhân ngôi nhà trở về — đó là bảy chú lùn làm nghề đào vàng trong núi. Thấy Bạch Tuyết xinh đẹp ngủ say, họ vô cùng ngạc nhiên và đem lòng yêu mến. Nghe nàng kể lại câu chuyện thương tâm, các chú lùn vui vẻ mời nàng ở lại cùng họ, chăm sóc nhà cửa cơm nước và dặn nàng không được mở cửa cho bất kỳ ai.

Ở hoàng cung, mụ hoàng hậu lại hỏi gương thần và kinh hoàng biết Bạch Tuyết vẫn còn sống tại nhà bảy chú lùn. Mụ ba lần cải trang thành bà lão bán hàng rong đến hãm hại nàng: lần đầu dùng dây thắt lưng thắt chặt làm nàng ngất lịm, lần thứ hai dùng lược tẩm thuốc độc cắm vào tóc nàng (cả hai lần đều được bảy chú lùn về kịp thời cứu sống).

Lần thứ ba, mụ hoàng hậu tẩm thuốc độc cực mạnh vào nửa bên đỏ của một quả táo thơm ngon. Mụ đóng giả bà lão nông dân mời Bạch Tuyết ăn thử. Thấy bà lão cắn nửa màu trắng không việc gì, Bạch Tuyết yên tâm cắn một miếng vào nửa bên đỏ. Ngay lập tức, miếng táo nghẹn lại ở cổ họng và nàng ngã gục xuống sàn bất tỉnh.

Các chú lùn trở về đau đớn khóc thương nhưng không thể làm nàng tỉnh lại. Họ đặt nàng vào một cỗ quan tài bằng pha lê trong suốt đặt trên đỉnh núi rực rỡ ngát hương hoa, ngày đêm thay phiên nhau canh giữ.

Ít lâu sau, một chàng hoàng tử đi săn qua núi nhìn thấy nàng Bạch Tuyết xinh đẹp trong quan tài pha lê liền đem lòng yêu tha thiết. Chàng tha thiết xin các chú lùn cho phép rước quan tài về hoàng cung để ngày ngày được ngắm nhìn nàng.

Khi những người hầu khiêng quan tài đi qua bụi cây gồ ghề, một người trượt chân làm chấn động quan tài. Miếng táo độc văng ra khỏi cổ họng Bạch Tuyết. Nàng mở mắt ngồi dậy, mỉm cười nhìn hoàng tử.

Hôn lễ tưng bừng của Bạch Tuyết và hoàng tử được tổ chức. Mụ hoàng hậu độc ác bị trừng phạt phải nhảy múa trong đôi giày sắt nung đỏ cho đến chết. Bạch Tuyết và hoàng tử sống bên nhau hạnh phúc trọn đời.`
  },
  {
    id: 'wd-co-be-quang-khan-do',
    title: 'Cô Bé Quàng Khăn Đỏ',
    category: 'World',
    iconEmoji: '🧣',
    readingTimeMinutes: 5,
    difficulty: 'Ngụ ngôn',
    ageRange: 'Mầm non (3-6)',
    author: 'Charles Perrault (Pháp)',
    moral: 'Luôn nghe lời cha mẹ dặn, không la cà và không được tin lời người lạ dọc đường.',
    content: `Ngày xưa ở một ngôi làng ven rừng, có một cô bé vô cùng đáng yêu được mọi người yêu mến, nhất là bà ngoại của cô. Bà may cho cô một chiếc khăn choàng bằng nhung đỏ thắm, cô bé thích lắm đi đâu cũng quàng nên mọi người gọi cô là Cô Bé Quàng Khăn Đỏ.

Một hôm, mẹ bảo Khăn Đỏ:
— Này con, bà ngoại đang bị ốm, con hãy mang giỏ bánh ngọt và bình sữa này sang thăm bà nhé. Nhớ đi đường thẳng, chớ có la cà trong rừng kẻo gặp nguy hiểm đấy!

Khăn Đỏ vâng lời mẹ xách giỏ lên đường. Nhưng khi bước vào khu rừng xanh mát, thấy chim hót líu lo, hoa bướm rập rờn, cô bé quên khuấy lời mẹ dặn liền rẽ vào rừng hái hoa bắt bướm.

Một con sói xám to lớn từ trong bụi rậm bước ra. Thấy cô bé ngây thơ, sói lân la hỏi chuyện:
— Chào cô bé xinh đẹp! Cháu đang đi đâu mà vội thế?
Khăn Đỏ thật thà đáp:
— Cháu mang bánh và sữa sang thăm bà ngoại cháu ở ngôi nhà dưới gốc ba cây sồi to đằng kia ạ!

Con sói nghĩ thầm: "Con bé này thịt non mềm ngon tuyệt, nhưng phải lừa bắt cả bà nó nữa mới no nê!". Sói bèn ngon ngọt bảo:
— Cháu nhìn xem trong rừng có bao nhiêu bông hoa đẹp rực rỡ, sao cháu không hái một bó to đem tặng bà ngoại chắc bà sẽ vui lắm đấy!

Khăn Đỏ nghe bùi tai liền mải mê chạy khắp nơi hái hoa. Trong lúc đó, con sói xám chạy thục mạng một mạch đến thẳng nhà bà ngoại. Nó gõ cửa "Cốc... cốc... cốc!".
Bà ngoại trong nhà hỏi vọng ra:
— Ai đấy?
Sói giả giọng Khăn Đỏ:
— Cháu là Khăn Đỏ mang bánh sang cho bà đây ạ!

Bà ngoại tưởng thật bảo:
— Cháu giật chốt cửa mở vào đi, bà đang mệt không dậy được.
Con sói xông vào, nuốt chửng bà ngoại vào bụng rồi mặc áo ngủ của bà, đội mũ trùm đầu rồi trèo lên giường kéo chăn kín cổ nằm chờ.

Lát sau, Khăn Đỏ ôm bó hoa rực rỡ đến gõ cửa bước vào. Thấy bà nằm trên giường trông là lạ, cô bé tiến lại gần hỏi:
— Bà ơi! Sao hôm nay tai bà to thế?
— Tai to để nghe cháu nói rõ hơn đấy cháu yêu!
— Bà ơi! Sao hôm nay mắt bà to thế?
— Mắt to để nhìn cháu rõ hơn đấy!
— Bà ơi! Sao mồm bà hôm nay to thế?
— Mồm to để... nuốt chửng cháu vào bụng cho dễ!

Nói dứt lời, con sói hung dữ chồm dậy nuốt chửng luôn Cô Bé Quàng Khăn Đỏ vào bụng rồi nằm phè ra ngáy rung cả mái nhà.

Đúng lúc đó, một bác thợ săn dũng cảm đi ngang qua nghe tiếng ngáy lạ lùng liền bước vào nhà xem. Nhìn thấy con sói nằm trên giường với cái bụng căng tròn, bác nhận ra ngay sự việc. Bác lấy kéo sắc rạch nhẹ bụng con sói đang ngủ say.

Kỳ diệu thay, đường kéo vừa rạch ra thì Cô Bé Quàng Khăn Đỏ và bà ngoại liền nhảy ra ngoài, vẫn còn sống nguyên vẹn! Bác thợ săn nhặt những hòn đá to nhét đầy vào bụng sói rồi khâu lại.

Khi con sói tỉnh dậy toan bỏ chạy, sức nặng của những hòn đá làm nó ngã gục xuống sàn chết tươi.

Ba bà cháu cùng nhau ăn bánh uống sữa vui vẻ. Cô Bé Quàng Khăn Đỏ ôm chầm lấy bà ngoại và tự hứa từ nay sẽ luôn nghe lời mẹ dặn, không bao giờ la cà nói chuyện với người lạ nữa.`
  },
  {
    id: 'wd-ong-lao-danh-ca-va-con-ca-vang',
    title: 'Ông Lão Đánh Cá Và Con Cá Vàng',
    category: 'World',
    iconEmoji: '🐟',
    readingTimeMinutes: 6,
    difficulty: 'Ngụ ngôn',
    ageRange: 'Mọi lứa tuổi',
    author: 'Aleksandr Pushkin (Nga)',
    moral: 'Lòng tham vô đáy và sự bội bạc sẽ hủy hoại tất cả; biết trân trọng những gì mình đang có.',
    content: `Ngày xưa có hai vợ chồng một ông lão đánh cá nghèo sống trong một túp lều rách nát ven bờ biển xanh thẳm. Hằng ngày ông lão quăng lưới bắt cá, còn mụ vợ ngồi nhà kéo sợi.

Một hôm, ông lão quăng lưới lần thứ nhất chỉ vớt được bùn rác; lần thứ hai chỉ được rong rêu; đến lần thứ ba, lưới kéo lên được một con cá nhỏ bằng vàng rực rỡ.

Kỳ lạ thay, con cá cất tiếng người nài nỉ:
— Ông lão ơi, xin ông hãy thả tôi về với biển xanh! Tôi sẽ trả ơn ông bằng bất cứ thứ gì ông muốn!

Ông lão hiền từ mủi lòng thả cá vàng xuống biển và bảo:
— Ta chẳng cần của cải gì của nhà ngươi đâu, ngươi cứ về biển sâu mà bơi lội thanh thản nhé!

Về nhà, ông lão kể lại chuyện lạ cho mụ vợ nghe. Mụ vợ lập tức tru tréo chửi bới:
— Đồ ngốc! Sao không bắt nó đền một chiếc máng lợn mới? Máng nhà mình đã vỡ đôi rồi kia kìa!

Ông lão lủi thủi ra biển. Biển gợn sóng êm ả. Ông gọi cá vàng lên kể chuyện. Cá vàng bảo:
— Ông lão đừng buồn, cứ về đi, nhà ông đã có một chiếc máng lợn mới tinh rồi!

Về đến nơi, quả nhiên có máng mới, nhưng mụ vợ lại chống nạnh quát:
— Đồ ngốc! Máng lợn thì đáng giá gì! Mau ra bảo cá vàng cho ta một ngôi nhà ngói khang trang có sân hoa!

Ông lão lại ra biển. Biển xanh đã nổi sóng dập dềnh. Cá vàng lắng nghe và an ủi ông lão cứ về. Về đến nơi, túp lều cũ đã biến thành một ngôi nhà ngói nguy nga có vườn tược hàng rào gỗ sáng bóng.

Nhưng lòng tham của mụ vợ không dừng lại ở đó. Mấy hôm sau, mụ lại bắt ông lão ra biển đòi cá vàng biến mụ thành một bà nhất phẩm phu nhân. Cá vàng lại đáp ứng. Khi ông về, mụ mặc áo gấm, cổ đeo ngọc trai, tay cầm roi quát tháo tớ gái đánh đuổi ông lão xuống chuồng ngựa quét dọn.

Ít lâu sau, mụ lại bắt ông lão ra biển đòi làm Nữ hoàng cai trị muôn dân. Ông lão van xin nhưng bị mụ tát vào mặt xua đi. Biển lúc này nổi sóng đen ngòm. Cá vàng lại thương tình đáp ứng. Ông lão về thấy mụ vợ ngồi trên ngai vàng uống rượu quý, xung quanh có quân lính bảo vệ.

Được vài tuần, mụ vợ lại phát điên vì quyền lực, sai quân bắt ông lão đến trước ngai phán:
— Mau ra biển bảo cá vàng rằng ta không muốn làm Nữ hoàng nữa! Ta muốn làm Long Vương ngự trị biển Đông, bắt cá vàng phải hầu hạ ta dưới trướng!

Ông lão sợ hãi lết ra biển. Biển nổi dông bão dữ dội, sóng cuộn trào đen ngòm sấm chớp ầm ầm. Ông lão cất tiếng gọi cá vàng ba lần. Cá vàng bơi lên hỏi:
— Ông lão cần gì nữa?
Ông lão cúi đầu nghẹn ngào kể lại lòng tham không đáy của mụ vợ.

Cá vàng không nói một lời nào, chỉ quẫy đuôi lặn sâu xuống đáy biển xanh biếc.

Ông lão đứng đợi mãi không thấy cá trả lời, đành lủi thủi quay gót trở về. Đến nơi, tòa lâu đài nguy nga biến mất, trước mắt ông lại là túp lều tranh rách nát năm xưa, và mụ vợ đang ngồi ủ rũ rách rưới bên cạnh chiếc máng lợn sứt mẻ ngày nào.`
  },
  {
    id: 'wd-ba-chu-heo-con',
    title: 'Ba Chú Heo Con',
    category: 'World',
    iconEmoji: '🐷',
    readingTimeMinutes: 5,
    difficulty: 'Dễ hiểu',
    ageRange: 'Mầm non (3-6)',
    author: 'Truyện cổ tích Châu Âu',
    moral: 'Chăm chỉ, kiên nhẫn và cẩn thận sẽ xây dựng nên nền tảng vững chắc vượt qua mọi bão giông.',
    content: `Ngày xưa có ba chú heo con sống cùng mẹ trong một trang trại ấm cúng. Khi đã lớn khôn, mẹ bảo ba anh em hãy ra ngoài tự xây nhà cho mình để bắt đầu cuộc sống tự lập.

Chú heo cả lười biếng, chỉ muốn làm cho nhanh để đi chơi, liền nhặt một đống rơm khô dựng thành một túp lều rơm ọp ẹp chỉ trong nửa ngày.

Chú heo thứ hai thích ăn ngủ, không muốn tốn nhiều công sức, bèn gom những cành cây khô dựng một ngôi nhà gỗ nhỏ trong hai ngày rồi vui vẻ chạy đi nhảy múa.

Riêng chú heo út chăm chỉ và chu đáo, chú nghĩ: "Nhà phải thật vững chắc mới chống được mưa gió và con sói xám hung dữ trong rừng!". Chú kiên trì gánh từng xe gạch, nhào từng xô vữa, xây từng viên gạch thẳng tắp. Mất cả tháng trời ròng rã, chú heo út mới hoàn thành một ngôi nhà gạch kiên cố có lò sưởi và ống khói vững chãi.

Một hôm, con sói xám đói khát mò từ trong rừng sâu ra. Nó đến gõ cửa nhà chú heo cả:
— Mở cửa ra ngay, không ta sẽ thổi bay ngôi nhà của ngươi!
Heo cả sợ hãi không mở. Con sói hít một hơi thật sâu rồi phù... phù... thổi bay túp lều rơm. Heo cả hốt hoảng chạy thục mạng sang nhà chú heo thứ hai.

Con sói đuổi theo đến trước nhà gỗ:
— Mở cửa ra, nếu không ta sẽ thổi sập ngôi nhà này!
Hai chú heo ôm nhau run rẩy. Sói lại hít hai hơi thật mạnh rồi phù... phù... Ngôi nhà gỗ lung lay rồi đổ sập tan tành. Hai chú heo con tháo chạy hết tốc lực sang nhà chú heo út.

Chú heo út vội kéo hai anh vào nhà rồi cài then chốt cửa thật chặt. Con sói chạy tới cười đắc thắng:
— Ta sẽ thổi bay cả căn nhà này và ăn thịt cả ba đứa chúng mày!

Sói phồng má trợn mắt hít hơi thổi: Phù...! Nhưng ngôi nhà gạch kiên cố không hề suy suyển dù chỉ một hạt bụi. Sói tức tối hít hơi thổi lần thứ hai, lần thứ ba, thổi đến đỏ gay cả mặt mày mà ngôi nhà vẫn trơ trơ vững như bàn thạch.

Tức tối, sói nhìn thấy ống khói trên mái nhà liền trèo lên toan chui theo ống khói tụt xuống ăn thịt ba chú heo. Nhưng chú heo út đã thông minh đoán trước, liền châm lửa đốt một nồi nước to sôi sùng sục dưới đáy lò sưởi.

Con sói vừa tụt xuống thì rơi trúng ngay vào nồi nước sôi bỏng rát. Nó thét lên một tiếng đau đớn rồi phóng vọt ra ngoài cửa chạy thẳng vào rừng sâu, không bao giờ dám bén mảng đến quấy rầy ba chú heo nữa.

Hai người anh vô cùng cảm phục và biết ơn chú heo út. Từ đó về sau, cả hai anh đều chăm chỉ học theo em, tự tay xây cho mình những ngôi nhà bằng gạch kiên cố và sống ấm no hạnh phúc.`
  },
  {
    id: 'wd-rua-va-tho',
    title: 'Rùa Và Thỏ',
    category: 'Fables',
    iconEmoji: '🐢',
    readingTimeMinutes: 4,
    difficulty: 'Ngụ ngôn',
    ageRange: 'Mầm non (3-6)',
    author: 'Aesop (Ngụ ngôn Hy Lạp)',
    moral: 'Chậm mà chắc, kiên trì nhẫn nại luôn chiến thắng thói kiêu ngạo tự mãn khinh địch.',
    content: `Vào một buổi sáng mùa thu mát mẻ, chú Thỏ với đôi chân dài nhanh nhẹn đang chạy nhảy tung tăng trong rừng. Nhìn thấy chú Rùa đang cặm cụi từng bước chậm chạp vác chiếc mai nặng nề, Thỏ bĩu môi chế giễu:
— Này anh Rùa! Anh bò chậm như sên thế kia thì đến bao giờ mới tới được đầu làng? Trông tôi phóng như bay đây này!

Rùa ngẩng đầu lên, điềm đạm trả lời:
— Anh chạy nhanh thật đấy, nhưng nếu thi chạy đua đến cây sồi cổ thụ bên kia sườn đồi, chưa chắc ai đã thắng ai đâu!

Thỏ phá lên cười sằng sặc:
— Ngươi mà dám thách đấu với ta ư? Được lắm, ta sẽ cho ngươi mở mắt thấy thế nào là tốc độ của loài Thỏ!

Muông thú trong rừng kéo đến xem rất đông. Bác Cáo được cử làm trọng tài. Khi tiếng hô "Bắt đầu!" vang lên, Thỏ phóng vút đi như một mũi tên xé gió, chỉ trong nháy mắt đã bỏ xa Rùa một quãng dài tít tắp.

Chạy được nửa đường, ngoái cổ nhìn lại không thấy bóng dáng Rùa đâu, Thỏ tự đắc nghĩ bụng:
— Cái tên Rùa chậm chạp kia có bò cả ngày cũng chẳng đuổi kịp ta! Trời mát mẻ thế này, tội gì không ngả lưng đánh một giấc dưới bóng râm, khi nào hắn bò đến gần ta chỉ cần nhón một bước là tới đích!

Nghĩ sao làm vậy, Thỏ nằm dài dưới bóng một gốc cây táo râm mát, lắng nghe tiếng gió rì rào rồi ngủ say sưa lúc nào không biết.

Trong khi đó, Rùa biết mình chậm chạp nên không một giây lơ là. Rùa kiên nhẫn nhích từng bước một, mồ hôi nhễ nhại nhưng lòng quyết tâm không hề lay chuyển. Rùa đi qua bụi cây, vượt qua con suối nhỏ, rồi lặng lẽ bước qua chỗ Thỏ đang nằm ngáy khò khò.

Mặt trời bắt đầu lặn dần về phía tây. Khi cơn gió lạnh chiều tà làm Thỏ giật mình tỉnh giấc, nó vươn vai ngáp dài nhìn về phía sau: "Chắc tên Rùa vẫn còn đang lết ở tít đằng kia!". Nhưng khi Thỏ phóng mắt nhìn về vạch đích dưới cây sồi già, nó rụng rời chân tay:
Rùa đã chạm chân tới đích trong tiếng hò reo cổ vũ nồng nhiệt vang dội của muôn loài muông thú!

Thỏ xấu hổ cụp đôi tai dài cắm đầu chạy trốn vào bụi rậm. Kể từ đó, Thỏ không bao giờ dám huênh hoang coi thường người khác nữa.`
  },
  {
    id: 'wd-aladdin-va-cay-den-than',
    title: 'Aladdin Và Cây Đèn Thần',
    category: 'Asia',
    iconEmoji: '🪔',
    readingTimeMinutes: 7,
    difficulty: 'Phiêu lưu',
    ageRange: 'Mọi lứa tuổi',
    author: 'Nghìn Lẻ Một Đêm (Ả Rập)',
    moral: 'Lòng dũng cảm, sự thông minh và tình yêu chân thành sẽ đánh bại mọi mưu mô xảo quyệt.',
    content: `Ngày xưa ở một thành phố phương Đông phồn hoa, có một chàng trai nghèo tên là Aladdin sống cùng người mẹ già tần tảo.

Một hôm, có một gã phù thủy xứ châu Phi giả làm người chú giàu có của Aladdin, rủ chàng vào sa mạc hứa cho nhiều vàng bạc. Đến một thung lũng hẻo lánh, phù thủy đọc thần chú mở ra một cửa hang bí mật dưới lòng đất. Hắn đưa cho Aladdin một chiếc nhẫn hộ mệnh và bảo chàng tụt xuống hang chỉ lấy duy nhất một chiếc đèn dầu cũ kỹ đặt trên bệ đá mang lên cho hắn.

Aladdin xuống hang, ngỡ ngàng thấy trong vườn toàn cây trái bằng ngọc bích, kim cương lấp lánh. Chàng lấy chiếc đèn cũ nhét vào ngực áo rồi hái thêm nhiều quả ngọc bỏ đầy túi.

Khi trèo lên đến miệng hang, Aladdin bảo:
— Bác hãy đỡ cháu lên trước đã rồi cháu trao đèn cho bác!
Tên phù thủy độc ác sợ lộ bèn quát tháo bắt đưa đèn trước. Thấy Aladdin không chịu, hắn nổi giận đọc thần chú sập cửa hang giam cầm chàng dưới lòng đất tối tăm.

Bị mắc kẹt trong bóng tối suốt hai ngày đói lả, trong lúc tuyệt vọng Aladdin vô tình xoa tay vào chiếc nhẫn hộ mệnh. Bỗng một luồng khói xanh bốc lên, một vị Thần Nhẫn khổng lồ hiện ra cúi đầu cung kính:
— Ta là Thần Nhẫn! Ngài muốn sai bảo điều gì, thần xin lập tức tuân lệnh!
Aladdin vội bảo:
— Xin Thần đưa tôi ra khỏi cái hang này trở về nhà với mẹ!

Trong chớp mắt, Aladdin đã đứng trước sân nhà mình. Hai mẹ con ôm nhau mừng rỡ. Thấy chiếc đèn cũ bám đầy bụi bẩn, người mẹ lấy khăn chùi sạch để đem bán mua gạo. Vừa chà nhẹ lên thân đèn, một luồng khói màu ngũ sắc bùng lên cuồn cuộn, một vị Thần Đèn khổng lồ oai nghiêm hiện ra cúi chào:
— Ta là Thần Đèn, chủ nhân của ngọn lửa thiêng! Ai cầm cây đèn này là chủ của ta, xin ngài cứ truyền lệnh!

Aladdin bảo Thần mang đến thức ăn ngon. Ngay lập tức, một bàn tiệc bằng bạc sáng loáng với những món ăn thơm ngon vương giả hiện ra trước mắt.

Nhờ có Thần Đèn giúp đỡ và tính tình nhân hậu chia sẻ của cải cho dân nghèo, Aladdin ngày càng được mọi người kính trọng. Chàng đem lòng yêu nàng công chúa Badroulbadour xinh đẹp của đức vua. Chàng dâng lên vua cha những mâm ngọc quý hiếm chưa từng thấy và nhờ Thần Đèn xây một tòa lâu đài bằng đá cẩm thạch tráng lệ chỉ trong một đêm để cưới công chúa.

Tên phù thủy hay tin Aladdin còn sống và giàu có liền tìm cách trả thù. Hắn đóng giả người đổi đèn cũ lấy đèn mới đi ngang qua cung điện. Công chúa không biết bí mật chiếc đèn cũ bèn đem ra đổi lấy chiếc đèn đồng mới toanh.

Chiếm được đèn thần, tên phù thủy lập tức sai Thần Đèn bốc cả tòa lâu đài cùng công chúa bay sang tận xứ châu Phi xa xôi.

Mất vợ và lâu đài, Aladdin bình tĩnh nhớ ra chiếc nhẫn thần trên tay. Chàng xoa nhẫn gọi Thần Nhẫn đưa mình sang châu Phi. Đến nơi, chàng bàn mưu cùng công chúa bỏ thuốc ngủ vào rượu của tên phù thủy. Khi hắn ngủ say như chết, Aladdin lấy lại cây đèn thần, tiêu diệt tên phù thủy gian ác và truyền Thần Đèn mang cung điện trở về quê hương trong sự chào đón tưng bừng của nhà vua và muôn dân.`
  },
  {
    id: 'wd-than-but-ma-luong',
    title: 'Thần Bút Mã Lương',
    category: 'Asia',
    iconEmoji: '🖌️',
    readingTimeMinutes: 6,
    difficulty: 'Ý nghĩa',
    ageRange: 'Mọi lứa tuổi',
    author: 'Cổ tích Dân gian Á Đông',
    moral: 'Tài năng nghệ thuật chân chính phải phục vụ nhân dân lương thiện; kẻ tham tàn bạo ngược tất gục ngã trước công lý.',
    content: `Ngày xưa có một cậu bé mồ côi tên là Mã Lương. Dù rất nghèo khổ, phải đi kiếm củi cắt cỏ nuôi thân, Mã Lương lại say mê hội họa đến cuồng nhiệt. Vì không có tiền mua bút lông, cậu lấy cành cây vẽ lên mặt đất, lấy lông chim chấm vào nước suối vẽ lên vách đá. Cậu vẽ chim, chim như sắp cất cánh bay; vẽ cá, cá như sắp lội dưới nước.

Một đêm nọ, Mã Lương nằm mộng thấy một ông cụ râu tóc bạc phơ bước tới trao cho cậu một cây bút lông bằng vàng sáng lấp lánh và dặn:
— Đây là cây bút thần! Ta tặng cho con vì con chăm chỉ và có tấm lòng nhân ái. Hãy dùng nó giúp đỡ những người nghèo khổ!

Tỉnh dậy, Mã Lương thấy cây bút lông vàng trong tay thật. Cậu thử vẽ một con chim én nhỏ lên tường. Kỳ diệu thay, vừa vẽ xong đôi mắt, con chim én liền vỗ cánh bay vút lên bầu trời cất tiếng hót véo von! Cậu vẽ một con cá chép, cá chép lập tức quẫy đuôi nhảy tọt xuống hồ bơi lội tung tăng.

Từ đó, Mã Lương dùng bút thần giúp đỡ dân nghèo trong làng: nhà ai thiếu cày, cậu vẽ cho cái cày; nhà ai thiếu trâu, cậu vẽ cho con trâu; vùng nào khô hạn, cậu vẽ cho mương dẫn nước ngọt. Cậu tuyệt đối không vẽ vàng bạc châu báu cho những kẻ lười biếng.

Tên địa chủ giàu có trong vùng nghe tin liền sai gia nhân bắt Mã Lương về giam trong ngục tối, ép cậu vẽ cho hắn tiền vàng núi bạc. Mã Lương kiên quyết từ chối. Giữa mùa đông rét buốt, địa chủ bỏ đói cậu trong chuồng ngựa. Mã Lương bèn vẽ một chiếc lò sưởi bập bùng và những chiếc bánh bao nóng hổi để ăn cùng những người bạn tù nghèo khó rồi vẽ một chiếc thang mây trèo qua tường thành trốn thoát.

Tin đồn đến tai Hoàng đế tàn bạo. Vua sai đại quân bắt Mã Lương về cung điện, cướp lấy cây bút thần rồi nhốt cậu lại. Vua tự tay cầm bút vẽ một ngọn núi vàng, nhưng vẽ xong núi vàng lại biến thành một tảng đá khổng lồ đổ sụp đè bẹp cả sân rồng.

Vua biết chỉ có Mã Lương mới điều khiển được bút bèn thả cậu ra, ngon ngọt dụ dỗ hứa phong chức tước nếu cậu chịu vẽ cho vua một cây rung ra tiền vàng giữa biển khơi.

Mã Lương vờ bằng lòng. Cậu cầm bút vẽ một vùng biển xanh mênh mông không một gợn sóng, giữa biển mọc lên một hòn đảo ngọc với cây tiền vàng rực rỡ. Vua cùng hoàng hậu và toàn bộ triều thần hớn hở bước lên một chiếc chiến thuyền lớn giương buồm ra khơi hái vàng.

Khi thuyền ra đến giữa đại dương bao la, Mã Lương vung bút vẽ thêm những đợt gió lớn. Thuyền lướt nhanh vun vút. Vua sợ hãi kêu: "Gió to quá rồi, đừng vẽ nữa!". Nhưng Mã Lương không dừng tay, cậu vung bút vẽ từng ngọn sóng thần cuồn cuộn dâng cao ngập trời, sấm sét xé toạc mây đen đánh chìm chiếc thuyền của tên bạo chúa xuống đáy biển sâu.

Trừ xong loài tàn bạo, Mã Lương lại mang cây bút thần chu du khắp bốn phương trời, vẽ trường học, vẽ ruộng đồng trĩu hạt mang lại ấm no, hạnh phúc cho nhân dân nghèo khổ.`
  }
];

export const CATEGORIES_LIST: { id: Story['category'] | 'All'; label: string; icon: string }[] = [
  { id: 'All', label: 'Tất Cả Truyện', icon: '📚' },
  { id: 'Vietnam', label: 'Cổ Tích Việt Nam', icon: '🇻🇳' },
  { id: 'Andersen', label: 'Cổ Tích Andersen', icon: '🦢' },
  { id: 'Grimm', label: 'Cổ Tích Grimm', icon: '🍎' },
  { id: 'World', label: 'Truyện Thế Giới', icon: '🌍' },
  { id: 'Fables', label: 'Truyện Ngụ Ngôn', icon: '🐢' },
  { id: 'Asia', label: 'Cổ Tích Á Đông', icon: '🪔' },
  { id: 'Custom', label: 'Truyện Tự Thêm', icon: '✏️' },
];
