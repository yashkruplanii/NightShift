import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

class SimpleNumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas for clear running page numbers and headers.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Running header on page 2 onwards
        if self._pageNumber > 1:
            self.drawString(36, letter[1] - 25, "NIGHTSHIFT — Project Report & Evaluation Guide (Simple & Plain English)")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.6)
            self.line(36, letter[1] - 28, letter[0] - 36, letter[1] - 28)

        # Running footer
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(36, 18, "NightShift: Safe Navigation for Late-Night Workers | Nagpur Pilot Corridor")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 36, 18, page_str)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(36, 26, letter[0] - 36, 26)

        self.restoreState()


def build_simple_pdf(filename="NightShift_Simple_Report.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'SimpleTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#0F172A")
    )

    subtitle_style = ParagraphStyle(
        'SimpleSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#0284C7")
    )

    h1_style = ParagraphStyle(
        'SimpleH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=5,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'SimpleBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor("#1E293B")
    )

    table_head = ParagraphStyle(
        'TableHead',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#1E293B")
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#0F172A")
    )

    q_title = ParagraphStyle(
        'QTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#0F172A")
    )

    ans_text = ParagraphStyle(
        'AnsText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor("#0F172A")
    )

    story = []

    # -------------------------------------------------------------
    # HEADER BANNER
    # -------------------------------------------------------------
    story.append(Paragraph("PROJECT REPORT: NIGHTSHIFT", title_style))
    story.append(Spacer(1, 3))
    story.append(Paragraph("A Safe Night-Time Map App Designed for Late-Night Workers", subtitle_style))
    story.append(Spacer(1, 4))

    meta_text = (
        "<b>Target Problem:</b> Safe travel for night-shift workers (nurses, guards, delivery partners, factory staff) | "
        "<b>City Pilot:</b> Nagpur, India<br/>"
        "<b>What is this document?</b> A simple, non-technical explanation of the project, how it works, and how to answer judges in evaluations."
    )
    story.append(Paragraph(meta_text, body_style))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0F172A"), spaceAfter=8))

    # -------------------------------------------------------------
    # 1. WHAT IS THIS PROJECT? (IN 60 SECONDS)
    # -------------------------------------------------------------
    story.append(Paragraph("1. What is this project? (The 60-Second Explanation)", h1_style))
    
    pitch_text = (
        "Imagine a nurse finishing her hospital night-duty at 2:30 AM in Nagpur. She wants to go home safely.<br/><br/>"
        "If she opens <b>Google Maps</b>, Google Maps only tries to find the <i>shortest or fastest</i> route. "
        "To save just 2 minutes, Google Maps often sends her through <b>dark, completely deserted back-alleys</b>. "
        "If she walks to a bus stop, she might find that the late-night bus was canceled. If she looks for a medicine shop, "
        "the map says 'Open', but in reality the metal shutter is locked.<br/><br/>"
        "<b>NightShift solves this completely.</b> It is a navigation app built specifically for the night. "
        "Instead of just finding the shortest distance, NightShift guarantees three simple rules:<br/>"
        "<b>1. It only guides you through bright, well-lit main streets</b> (no scary unlit dark shortcuts).<br/>"
        "<b>2. You are NEVER alone:</b> At every single second of your walk, an open police booth, hospital, or 24/7 chemist is within a 2-minute run.<br/>"
        "<b>3. Automatic Backup Plan:</b> If a late-night bus doesn't show up, the app instantly switches to an armed backup route before you get stranded."
    )

    box = Table([[Paragraph(pitch_text, body_style)]], colWidths=[540])
    box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('LINELEFT', (0,0), (-1,-1), 4, colors.HexColor("#0284C7")),
    ]))
    story.append(box)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # 2. WHY GOOGLE MAPS IS NOT ENOUGH AT NIGHT
    # -------------------------------------------------------------
    story.append(Paragraph("2. How NightShift is Different from Google Maps & Apple Maps", h1_style))
    story.append(Paragraph("Here is why standard map apps fail at 2 AM, and how NightShift fixes each issue:", body_style))
    story.append(Spacer(1, 5))

    diff_data = [
        [Paragraph("What happens at 2 AM?", table_head), Paragraph("Google Maps / Apple Maps", table_head), Paragraph("Our App (NightShift)", table_head)],
        [
            Paragraph("Picking a Route", table_cell_bold),
            Paragraph("Picks the fastest route, even if it leads you into a pitch-dark, dangerous alley to save 1 minute.", table_cell),
            Paragraph("<b>Rejects dark shortcuts.</b> Only routes you along well-lit roads with streetlights and active shops.", table_cell)
        ],
        [
            Paragraph("Emergency Safety", table_cell_bold),
            Paragraph("No safety guarantee. You could be 3 km away from any open help without knowing it.", table_cell),
            Paragraph("<b>Guaranteed Safety Shield:</b> A verified open police booth or 24/7 hospital is always within 400 meters (a 2-minute run).", table_cell)
        ],
        [
            Paragraph("Late-Night Buses", table_cell_bold),
            Paragraph("Shows daytime schedules. If the 2:15 AM bus is canceled, you are left stranded alone in the dark.", table_cell),
            Paragraph("<b>Last Bus Trap Protection:</b> Checks live bus freshness. If a bus doesn't report in, it automatically gives you a backup route.", table_cell)
        ],
        [
            Paragraph("Open Pharmacies", table_cell_bold),
            Paragraph("Rely on random public edits. Often says 'Open 24 hours' when the store is actually closed.", table_cell),
            Paragraph("<b>Government Verified:</b> Only shows pharmacies with official FDA 24/7 emergency licenses.", table_cell)
        ],
        [
            Paragraph("No Internet / Bad Signal", table_cell_bold),
            Paragraph("Freezes or fails to recalculate routes when mobile data drops in dead zones.", table_cell),
            Paragraph("<b>100% Offline:</b> The entire route, safe spots, and emergency contacts are saved on your phone and work without internet.", table_cell)
        ],
    ]

    diff_table = Table(diff_data, colWidths=[100, 215, 225])
    diff_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(diff_table)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # 3. TECH STACK IN PLAIN ENGLISH
    # -------------------------------------------------------------
    story.append(Paragraph("3. Our Technology Stack (Explained in Simple English)", h1_style))
    story.append(Paragraph("What tools we used to build the app, and what each tool does in simple words:", body_style))
    story.append(Spacer(1, 5))

    tech_data = [
        [Paragraph("Component", table_head), Paragraph("Tool Used", table_head), Paragraph("What does it do? (Simple Explanation)", table_head)],
        [
            Paragraph("User Screen (UI)", table_cell_bold),
            Paragraph("React + Tailwind CSS", table_cell),
            Paragraph("Builds the clean, dark-mode screen that looks like Apple Maps and is easy on tired eyes at night.", table_cell)
        ],
        [
            Paragraph("Interactive Map", table_cell_bold),
            Paragraph("Leaflet GIS + OpenStreetMap", table_cell),
            Paragraph("Draws the city streets, road lights, route paths, and pins for police booths and hospitals.", table_cell)
        ],
        [
            Paragraph("Smart Brain (Router)", table_cell_bold),
            Paragraph("FAROS Decision Engine", table_cell),
            Paragraph("The core logic that tests routes: it checks street lighting scores, verifies you are near a safe place, and calculates accurate arrival times.", table_cell)
        ],
        [
            Paragraph("Emergency Siren", table_cell_bold),
            Paragraph("Web Audio API", table_cell),
            Paragraph("Plays loud alarm sounds and safety audio directly from your phone's speaker without needing internet.", table_cell)
        ],
        [
            Paragraph("City Data", table_cell_bold),
            Paragraph("Official Govt Schedules", table_cell),
            Paragraph("Real schedules from Nagpur Metro (NMRCL), Aapli Bus, and Nagpur Police emergency desks.", table_cell)
        ],
    ]

    tech_table = Table(tech_data, colWidths=[90, 130, 320])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # 4. STRENGTHS AND WEAKNESSES
    # -------------------------------------------------------------
    story.append(Paragraph("4. Strengths & Weaknesses (Be Honest with Judges)", h1_style))
    story.append(Spacer(1, 4))

    sw_text = (
        "<b>What Our Model Does Best (Strengths):</b><br/>"
        "• <b>Prioritizes Life Over Speed:</b> Normal maps care about saving 60 seconds; our app cares about getting you home alive.<br/>"
        "• <b>Always Has a Plan B:</b> Gives you both a Primary Route and a Standby Backup Route right away.<br/>"
        "• <b>Works Without Internet:</b> If your phone loses signal in a basement or dead zone, the app still works completely.<br/>"
        "• <b>Zero Fake Data:</b> All emergency numbers, hospitals, and bus stops are real and verified by city records.<br/><br/>"
        "<b>Where We Can Improve in the Future (Weaknesses / Limitations):</b><br/>"
        "• <b>Currently Built for Nagpur Pilot:</b> We tested and mapped the GMCH to Manewada corridor first. In the future, we will expand to other cities.<br/>"
        "• <b>Live Bus GPS:</b> Right now, bus timings are based on official night schedules with freshness checks. In the future, we will plug directly into the Smart City live GPS bus trackers.<br/>"
        "• <b>Smart Streetlight Sensors:</b> Right now, street lighting is based on road surveys. In the future, we will connect directly to the city's smart streetlight electric grid."
    )

    sw_table = Table([[Paragraph(sw_text, body_style)]], colWidths=[540])
    sw_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F0FDF4")),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#BBF7D0")),
        ('LINELEFT', (0,0), (-1,-1), 4, colors.HexColor("#16A34A")),
    ]))
    story.append(sw_table)
    story.append(Spacer(1, 10))

    # -------------------------------------------------------------
    # 5. HOW TO ANSWER QUESTIONS IN MID EVALUATIONS
    # -------------------------------------------------------------
    story.append(Paragraph("5. What Questions Will Judges Ask? (Easy Winning Answers)", h1_style))
    story.append(Paragraph("Memorize these simple, plain-English answers to impress your evaluation panel:", body_style))
    story.append(Spacer(1, 5))

    qa_list = [
        (
            "Judge Question 1: 'Why make a new app? Why not just use Google Maps?'",
            "Say this: 'Google Maps was built for daytime driving. It only cares about saving time, which means at 2 AM it will happily send a lone nurse through a pitch-dark, deserted alley to save 90 seconds. NightShift has a completely different goal: safety. It keeps you on well-lit streets, guarantees a police station or hospital is within a 2-minute run at all times, and gives an automatic backup route if a bus doesn't show up.'"
        ),
        (
            "Judge Question 2: 'Why are the travel times for the Primary and Standby route different?'",
            "Say this: 'The Primary route is the normal journey when everything goes smoothly. The Standby route is your safety net—it includes the real-world time needed to reach a safe 24/7 police booth, wait for a pre-arranged cab, and take main illuminated flyovers. At night, having a realistic buffer that gets you to work safely before curfew is much better than an unrealistic shortcut that gets you stranded.'"
        ),
        (
            "Judge Question 3: 'What happens if the user's mobile data or internet dies?'",
            "Say this: 'NightShift is built Offline-First. The entire road network, lighting information, emergency phone numbers, and safe spots are stored right on the user's phone. Even with 0 internet bars, the app gives full turn-by-turn guidance and sounds safety sirens without needing Wi-Fi or data.'"
        ),
        (
            "Judge Question 4: 'Is this data real, or did you make it up for the hackathon?'",
            "Say this: 'It is 100% real government data. We used the official Nagpur Metro schedule, NMC Aapli Bus circulars, Nagpur Police Dial 112 desks, and Maharashtra FDA licenses for 24/7 pharmacies. You can click on the Government Registry in our app right now to view the exact government circular numbers and landline contacts.'"
        ),
        (
            "Judge Question 5: 'What will you do next with this project?'",
            "Say this: 'Our next step is integrating directly with the Nagpur Smart City control room (ICCC) to get live GPS from city buses and connect with smart streetlight sensors to detect broken streetlights in real time.'"
        ),
    ]

    for q, a in qa_list:
        qa_data = [
            [Paragraph(f"<b>{q}</b>", q_title)],
            [Paragraph(a, ans_text)]
        ]
        qa_table = Table(qa_data, colWidths=[540])
        qa_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
            ('LINELEFT', (0,0), (-1,-1), 3.5, colors.HexColor("#0F172A")),
        ]))
        story.append(qa_table)
        story.append(Spacer(1, 4))

    doc.build(story, canvasmaker=SimpleNumberedCanvas)
    print(f"Successfully generated {filename} (Size: {os.path.getsize(filename)} bytes)")

if __name__ == "__main__":
    out_pdf = "NightShift_Simple_Report.pdf"
    if len(sys.argv) > 1:
        out_pdf = sys.argv[1]
    build_simple_pdf(out_pdf)
