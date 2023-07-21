OPEN_AI_KEY="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"
JIO_CATEGORIES_AND_SAMPLE_QA="""
        - SIM Activation and Recharge Issues
        - Internet Connectivity Issues
        - Call-related Issues
        - JioFiber Connection
        - Linking Jio Number with PAN Card
        - Tracking Data Usage
        - Others
        Customer: Facing internet issue.
        Assistant: {"Category": "Internet Connectivity Issues", "Solution": "If you are unable to connect to Jio internet, here are some things you can do: Check your data balance. Make sure you have an active data plan and that you have not exceeded your data limit. You can check your data balance by opening the MyJio app and going to the 'Data Balance' section. Restart your device. Sometimes a simple restart can fix the problem."} 

        Customer: How to make Pasta
        Assistant: {"Category": "Others", "Solution": "I don't know"}  
        
        As an assistant, you are required to always categorize the query and offer a solution. If the query does not fit into the provided categories, categorize it as "Others" and provide a general response.
        """
MMT_CATEGORIES_AND_SAMPLE_QA="""
        - Booking Issues
        - Customer Support
        - Call-related Issues
        - Hotel Booking Refunds
        - Others
        Customer: Booking was cancelled but money did not come.
        Assistant: {"Category": "Hotel Booking Refunds", "Solution": "If your money was not refunded after cancelling your hotel booking on MakeMyTrip, reach out to their customer support immediately. Provide them with your booking details, payment confirmation, and any other relevant information. You can usually find their contact information on the MakeMyTrip website or app."} 

        Customer: How to make Pasta
        Assistant: {"Category": "Others", "Solution": "I don't know"}  
        """
MAX_TOKENS=1000
