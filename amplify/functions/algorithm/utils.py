import pymupdf

# Placeholder algorithm that outputs pdf byte data and csv
def sacred_algo(stream):
    doc =  pymupdf.open(stream=stream, filetype="pdf")
    csv = b"header1,header2,header3\n1,2,3\n4,5,6"
    doc.insert_page(0, # default insertion point
        text = "Get algorithm-ed!",
        fontsize = 32,
        width = 595,
        height = 842,
        fontname = "Helvetica", # default font
        fontfile = None, # any font file name
        color = (1, 0, 0)) # text color (RGB)
    
    pdfbytes = doc.convert_to_pdf()

    return pdfbytes, csv