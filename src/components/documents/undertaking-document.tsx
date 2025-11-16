import React, { FunctionComponent } from "react";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "../../../public/square_logo.jpg";
import moment from "moment";

const UndertakingDocument: FunctionComponent<{
  signature: string;
  date: string;
  planName: string;
  duration: number;
}> = ({ date, signature, duration, planName }) => {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#f6f6f7",
      fontFamily: "Courier",
      padding: 30,
    },
    header: {
      textAlign: "center",
    },
    logo: {
      height: 60,
      width: 60,
      borderRadius: 5,
      marginBottom: "10px",
      objectFit: "contain",
      marginHorizontal: "auto",
    },
    displayName: {
      fontWeight: "bold",
      fontSize: "22px",
      marginBottom: "5px",
    },
    address: {
      fontSize: "12px",
      paddingHorizontal: "40px",
      fontFamily: "Times-Roman",
      textTransform: "uppercase",
      color: "#aaa",
    },

    separator: {
      backgroundColor: "#c38c2f",
      height: "2px",
      marginTop: "20px",
      marginBottom: "60px",
      borderRadius: 4,
      width: "100%",
    },
  });

  return (
    <Document style={{ width: "100%" }}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logo.src} style={styles.logo} />
          <Text style={styles.displayName}>
            SENSEI FITNESS AND WELLNESS GYM
          </Text>
          <Text style={styles.address}>
            Opposite University of Ilorin Teaching Hospital, Old Jebba RD,
            Ilorin, Kwara State +234 812 082 5084
          </Text>
        </View>
        <View style={styles.separator}>Hello</View>
        <View style={{ fontFamily: "Times-Roman", marginBottom: "50px" }}>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "12px",
              marginBottom: "20px",
              textDecoration: "underline",
              fontFamily: "Helvetica",
            }}
          >
            UNDERTAKING DOCUMENT
          </Text>
          <View
            style={{
              fontSize: "12px",
              fontWeight: "light",
              lineHeight: "22px",
            }}
          >
            <Text style={{ marginBottom: "10px" }}>
              By subscribing as a member of SEN-SEI FITNESS, I acknowledge that
              I am fully aware of my current health condition and confirm that I
              am medically fit to participate in physical exercise and fitness
              activities.
            </Text>
            <Text style={{ marginBottom: "10px" }}>
              I understand that all workouts and training sessions involve some
              level of physical exertion and carry inherent risks. I willingly
              choose to participate and accept full responsibility for my health
              and safety throughout my involvement with SEN-SEI FITNESS.
            </Text>
            <Text style={{ marginBottom: "10px" }}>
              Furthermore, I hereby release SEN-SEI FITNESS, its trainers,
              staff, and affiliates from any liability for injuries, health
              complications, or death that may occur as a result of my
              participation in any fitness activities, whether supervised or
              unsupervised, during my membership period.
            </Text>
            <Text style={{ marginBottom: "10px" }}>
              By agreeing to this subscription, I confirm that I have read,
              understood, and accepted these terms.
            </Text>
          </View>
        </View>
        <View
          style={{ fontFamily: "Helvetica", fontSize: "12px", flexGrow: 1 }}
        >
          <Text style={{ marginBottom: "5px" }}>
            Plan Name:{" "}
            <Text style={{ paddingHorizontal: "10px" }}>{planName}</Text>
          </Text>
          <Text style={{ marginBottom: "5px" }}>
            Duration:{" "}
            <Text style={{ paddingHorizontal: "10px" }}>
              {duration} day{duration > 1 ? "s" : ""}
            </Text>
          </Text>
          <Text style={{ marginBottom: "5px" }}>
            Signature:{" "}
            <Text
              style={{
                paddingHorizontal: "10px",
              }}
            >
              {signature}
            </Text>
          </Text>
          <Text>
            Date:{" "}
            <Text style={{ paddingHorizontal: "10px" }}>
              {moment(date).format("DD/MM/YYYY")}
            </Text>
          </Text>
        </View>
        <Text style={{ textAlign: "center", fontSize: "10px" }}>
          {" "}
          © {new Date().getFullYear()} Sensei Fitness. All Rights Reserved
        </Text>
      </Page>
    </Document>
  );
};

export default UndertakingDocument;
